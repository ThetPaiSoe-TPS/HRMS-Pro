File 16: Deployment Architecture
1. Deployment Environment
Production Environment
text
┌─────────────────────────────────────────────────────┐
│                 Production Architecture              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐         ┌──────────────┐        │
│  │   Cloudflare │────────│    AWS/DO    │        │
│  │   (CDN)      │         │   (Server)   │        │
│  └──────────────┘         └──────────────┘        │
│         │                        │                  │
│         ↓                        ↓                  │
│  ┌──────────────┐         ┌──────────────┐        │
│  │  Nginx       │────────│  Laravel     │        │
│  │  (Web Server)│         │  Application │        │
│  └──────────────┘         └──────────────┘        │
│         │                        │                  │
│         ↓                        ↓                  │
│  ┌──────────────┐         ┌──────────────┐        │
│  │  React       │         │  MySQL       │        │
│  │  (Static)    │         │  Database    │        │
│  └──────────────┘         └──────────────┘        │
│         │                        │                  │
│         ↓                        ↓                  │
│  ┌──────────────┐         ┌──────────────┐        │
│  │  Redis       │         │  MinIO/S3    │        │
│  │  (Cache)     │         │  (Storage)   │        │
│  └──────────────┘         └──────────────┘        │
│                                                     │
└─────────────────────────────────────────────────────┘
2. Server Requirements
Minimum Production Requirements
Component	Requirement
CPU	2 vCPUs
RAM	4 GB
Storage	50 GB SSD
Database	MySQL 8.0 or PostgreSQL 14+
Web Server	Nginx 1.20+
PHP Version	8.2+
Node.js	18+
Redis	7.0+
Recommended Production Requirements
Component	Requirement
CPU	4 vCPUs
RAM	8 GB
Storage	100 GB SSD
Database	MySQL 8.0 or PostgreSQL 14+
Web Server	Nginx 1.20+
PHP Version	8.2+
Node.js	18+
Redis	7.0+
3. Docker Setup
Dockerfile (Backend)
dockerfile
# Dockerfile (Laravel)
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application
COPY . /var/www/html
WORKDIR /var/www/html

# Install dependencies
RUN composer install --no-interaction --no-dev --optimize-autoloader
RUN npm install && npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/storage
RUN chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
Docker Compose
yaml
# docker-compose.yml
version: '3.8'

services:
  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: hrms-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
      - DB_CONNECTION=mysql
      - DB_HOST=database
      - DB_PORT=3306
      - DB_DATABASE=hrms
      - DB_USERNAME=hrms_user
      - DB_PASSWORD=secure_password
      - REDIS_HOST=cache
      - REDIS_PORT=6379
    volumes:
      - ./backend:/var/www/html
      - ./storage:/var/www/html/storage
    depends_on:
      - database
      - cache

  # Frontend (React)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: hrms-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000/api/v1
    depends_on:
      - backend

  # Database
  database:
    image: mysql:8.0
    container_name: hrms-database
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=hrms
      - MYSQL_USER=hrms_user
      - MYSQL_PASSWORD=secure_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  # Cache (Redis)
  cache:
    image: redis:7.0-alpine
    container_name: hrms-cache
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - cache_data:/data

  # Nginx Web Server
  webserver:
    image: nginx:alpine
    container_name: hrms-webserver
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./backend:/var/www/html
      - ./nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - backend
      - frontend

volumes:
  db_data:
  cache_data:
4. CI/CD Pipeline
GitHub Actions Workflow
yaml
# .github/workflows/deploy.yml
name: Deploy HRMS Pro

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: hrms_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        
    - name: Copy .env
      run: php -r "file_exists('.env') || copy('.env.example', '.env');"
      
    - name: Install Dependencies
      run: |
        composer install --no-interaction --no-dev --optimize-autoloader
        npm install
        npm run build
        
    - name: Generate Key
      run: php artisan key:generate
        
    - name: Run Migrations
      run: php artisan migrate --force
        
    - name: Run Tests
      run: php artisan test
      
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /var/www/hrms-pro
          git pull origin main
          composer install --no-interaction --no-dev --optimize-autoloader
          npm install
          npm run build
          php artisan migrate --force
          php artisan optimize:clear
          php artisan optimize
          sudo systemctl restart php8.2-fpm
          sudo systemctl restart nginx
5. Environment Variables
bash
# .env.production

# Application
APP_NAME=HRMS Pro
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hrms-pro.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrms_production
DB_USERNAME=hrms_user
DB_PASSWORD=secure_password

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=hrms@company.com
MAIL_PASSWORD=email_password
MAIL_ENCRYPTION=tls

# Sanctum
SANCTUM_STATEFUL_DOMAINS=hrms-pro.com
SESSION_DOMAIN=.hrms-pro.com

# CORS
CORS_ALLOWED_ORIGINS=https://hrms-pro.com

# Services
AWS_ACCESS_KEY_ID=aws_key
AWS_SECRET_ACCESS_KEY=aws_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=hrms-pro-storage

# Queue
QUEUE_CONNECTION=redis