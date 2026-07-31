<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class IndexingDemoProduct extends Model
{
    protected $table = 'indexing_demo_products';

    protected $fillable = [
        'name',
        'sku',
        'price',
        'cost',
        'stock_quantity',
        'category',
        'brand',
        'supplier',
        'is_active',
        'is_featured',
        'views_count',
        'sales_count',
        'launch_date',
        'expiry_date'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'cost' => 'decimal:2',
    ];

    // ============================================
    // QUERIES THAT USE INDEXES
    // ============================================

    /**
     * Query with full index usage (is_active, category, price)
     */
    public function scopeIndexedSearch(Builder $query, array $filters): Builder
    {
        return $query
            ->when(isset($filters['is_active']), function ($q) use ($filters) {
                $q->where('is_active', $filters['is_active']);
            })
            ->when(isset($filters['category']), function ($q) use ($filters) {
                $q->where('category', $filters['category']);
            })
            ->when(isset($filters['min_price']), function ($q) use ($filters) {
                $q->where('price', '>=', $filters['min_price']);
            })
            ->when(isset($filters['max_price']), function ($q) use ($filters) {
                $q->where('price', '<=', $filters['max_price']);
            })
            ->when(isset($filters['brand']), function ($q) use ($filters) {
                $q->where('brand', $filters['brand']);
            })
            ->orderBy('created_at', 'desc');
    }

    /**
     * Query without indexes (using LIKE on name)
     */
    public function scopeNoIndexSearch(Builder $query, string $searchTerm): Builder
    {
        return $query->where('name', 'LIKE', "%{$searchTerm}%");
    }

    /**
     * Get product by category (uses composite index)
     */
    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /**
     * Get active products by brand (uses composite index)
     */
    public function scopeActiveByBrand(Builder $query, string $brand): Builder
    {
        return $query->where('is_active', true)->where('brand', $brand);
    }

    /**
     * Get products by price range (uses index on price)
     */
    public function scopeByPriceRange(Builder $query, float $min, float $max): Builder
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    /**
     * Get featured products (uses index on is_featured)
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get low stock products (uses index on stock_quantity)
     */
    public function scopeLowStock(Builder $query, int $threshold = 10): Builder
    {
        return $query->where('stock_quantity', '<', $threshold);
    }

    /**
     * Get products launched this year (uses index on launch_date)
     */
    public function scopeLaunchedThisYear(Builder $query): Builder
    {
        return $query->whereYear('launch_date', now()->year);
    }

    /**
     * Complex query using multiple indexes
     */
    public function scopeAdvancedSearch(Builder $query, array $params): Builder
    {
        return $query
            ->when(isset($params['is_active']), function ($q) use ($params) {
                $q->where('is_active', $params['is_active']);
            })
            ->when(isset($params['category']), function ($q) use ($params) {
                $q->where('category', $params['category']);
            })
            ->when(isset($params['brand']), function ($q) use ($params) {
                $q->where('brand', $params['brand']);
            })
            ->when(isset($params['min_price']), function ($q) use ($params) {
                $q->where('price', '>=', $params['min_price']);
            })
            ->when(isset($params['max_price']), function ($q) use ($params) {
                $q->where('price', '<=', $params['max_price']);
            })
            ->when(isset($params['min_stock']), function ($q) use ($params) {
                $q->where('stock_quantity', '>=', $params['min_stock']);
            })
            ->orderBy('created_at', 'desc');
    }

    /**
     * Query that triggers table scan (no index available)
     */
    public function scopeNoIndexComplex(Builder $query, array $params): Builder
    {
        return $query
            ->when(isset($params['search']), function ($q) use ($params) {
                $q->where('name', 'LIKE', "%{$params['search']}%")
                    ->orWhere('sku', 'LIKE', "%{$params['search']}%");
            })
            ->when(isset($params['supplier']), function ($q) use ($params) {
                $q->where('supplier', 'LIKE', "%{$params['supplier']}%");
            });
    }
}
