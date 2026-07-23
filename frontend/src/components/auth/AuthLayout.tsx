import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  showFooter?: boolean;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
  showFooter = true,
  logoSrc = '/HRSM-pro.png', 
  logoAlt = 'Logo',
  logoWidth = 200,
  logoHeight = 200,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {showLogo && (
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={logoAlt}
                  width={logoWidth}
                  height={logoHeight}
                  className="object-contain w-full h-full"
                />
              ) : (
                <span className="text-white text-3xl font-bold tracking-tight">H</span>
              )}
            </div>
          </div>
        )}
        <h2 className="mt-6 text-center text-h1 text-text-primary tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-small text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-card sm:rounded-card sm:px-10 border border-secondary-200">
          {children}
        </div>
        
        {showFooter && (
          <div className="mt-6 text-center text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} HRMS Pro. All rights reserved.
          </div>
        )}
      </div>
    </div>
  );
};