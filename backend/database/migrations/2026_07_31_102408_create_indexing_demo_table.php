<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Create products table with indexes
        Schema::create('indexing_demo_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('sku')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('cost', 10, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->string('category');
            $table->string('brand')->nullable();
            $table->string('supplier')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('views_count')->default(0);
            $table->integer('sales_count')->default(0);
            $table->date('launch_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->timestamps();

            // ============================================
            // SINGLE COLUMN INDEXES
            // ============================================
            $table->index('price');
            $table->index('category');
            $table->index('brand');
            $table->index('is_active');
            $table->index('stock_quantity');
            $table->index('created_at');
            $table->index('launch_date');

            // ============================================
            // COMPOSITE INDEXES
            // ============================================
            // For searching active products by category
            $table->index(['is_active', 'category']);
            // For active products in a price range
            $table->index(['is_active', 'price']);
            // For filtering by brand and category
            $table->index(['brand', 'category']);
            // For sorting by launch date
            $table->index(['is_active', 'launch_date']);
        });

        // Create logs table for query analysis
        Schema::create('indexing_demo_queries', function (Blueprint $table) {
            $table->id();
            $table->string('query_type');
            $table->string('search_term')->nullable();
            $table->text('query');
            $table->decimal('execution_time', 10, 4);
            $table->integer('row_count');
            $table->string('index_used')->nullable();
            $table->timestamps();
        });

        // Seed demo data
        $this->seedDemoData();
    }

    public function down()
    {
        Schema::dropIfExists('indexing_demo_products');
        Schema::dropIfExists('indexing_demo_queries');
    }

    private function seedDemoData()
    {
        $categories = ['Electronics', 'Clothing', 'Books', 'Food', 'Toys', 'Sports', 'Health', 'Beauty', 'Home', 'Auto'];
        $brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Puma', 'Microsoft', 'Google', 'Amazon', 'LG'];
        $suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Supplier E'];

        for ($i = 0; $i < 10000; $i++) {
            $price = rand(10, 9999) / 100;
            $cost = $price * (0.6 + (rand(0, 40) / 100));
            $stock = rand(0, 5000);

            DB::table('indexing_demo_products')->insert([
                'name' => 'Product ' . ($i + 1) . ' - ' . $categories[array_rand($categories)],
                'sku' => 'SKU-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'price' => $price,
                'cost' => round($cost, 2),
                'stock_quantity' => $stock,
                'category' => $categories[array_rand($categories)],
                'brand' => $brands[array_rand($brands)],
                'supplier' => $suppliers[array_rand($suppliers)],
                'is_active' => (bool)rand(0, 10) > 2,
                'is_featured' => (bool)rand(0, 100) > 90,
                'views_count' => rand(0, 10000),
                'sales_count' => rand(0, 1000),
                'launch_date' => date('Y-m-d', strtotime('-' . rand(0, 730) . ' days')),
                'expiry_date' => rand(0, 10) > 7 ? date('Y-m-d', strtotime('+' . rand(30, 365) . ' days')) : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
};
