<?php
// database/migrations/2026_07_31_create_search_demo_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('search_demo_records', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->text('content');
            $table->string('category', 50)->nullable();
            $table->timestamps();
        });

        // Add full-text index
        DB::statement('ALTER TABLE search_demo_records ADD FULLTEXT search_demo_fulltext (title, content)');

        // Seed with meaningful data
        $this->seedDemoData();
    }

    public function down()
    {
        Schema::dropIfExists('search_demo_records');
    }

    private function seedDemoData()
    {
        $data = [
            // Laravel related
            [
                'title' => 'Laravel Framework - Complete Guide',
                'content' => 'Laravel is a PHP framework for web artisans with elegant syntax and powerful features. It includes Eloquent ORM, Blade templating, and robust authentication.',
                'category' => 'Laravel'
            ],
            [
                'title' => 'Laravel Eloquent ORM Basics',
                'content' => 'Laravel Eloquent provides an active record implementation for working with your database. It supports relationships, eager loading, and full-text search.',
                'category' => 'Laravel'
            ],
            [
                'title' => 'Laravel Full-Text Search Implementation',
                'content' => 'Laravel supports full-text search through MySQL, PostgreSQL, and Scout drivers. Full-text search is optimized for large text fields.',
                'category' => 'Laravel'
            ],

            // Database related
            [
                'title' => 'MySQL Full-Text Index Explained',
                'content' => 'MySQL InnoDB supports full-text indexing since version 5.6. It uses inverted indexes to enable fast text searches on large datasets.',
                'category' => 'Database'
            ],
            [
                'title' => 'Database Indexing Strategies for Search',
                'content' => 'Database indexing is crucial for application performance. Full-text indexes use inverted indexes that map words to document IDs.',
                'category' => 'Database'
            ],
            [
                'title' => 'MySQL vs PostgreSQL Full-Text Search',
                'content' => 'Both MySQL and PostgreSQL support full-text search with different syntaxes. MySQL uses MATCH() AGAINST(), PostgreSQL uses to_tsvector().',
                'category' => 'Database'
            ],

            // Search related
            [
                'title' => 'Full-Text Search Performance Benefits',
                'content' => 'Full-text search provides better performance than LIKE queries. It uses specialized indexes and relevance scoring for accurate results.',
                'category' => 'Search'
            ],
            [
                'title' => 'Boolean Search Mode in MySQL',
                'content' => 'Boolean mode search allows operators like + (must include), - (must exclude), and * (wildcard) for complex queries.',
                'category' => 'Search'
            ],
            [
                'title' => 'Natural Language Search Explained',
                'content' => 'Natural language search understands human language patterns and returns results based on relevance scoring.',
                'category' => 'Search'
            ],

            // Performance related
            [
                'title' => 'LIKE vs Full-Text Performance Comparison',
                'content' => 'Performance comparison between LIKE and MATCH...AGAINST shows clear differences. Full-text search is 10-100x faster on large datasets.',
                'category' => 'Performance'
            ],
            [
                'title' => 'Search Optimization Techniques for Developers',
                'content' => 'Search optimization is important for large datasets. Using full-text indexes can reduce query time from seconds to milliseconds.',
                'category' => 'Performance'
            ],
            [
                'title' => 'Database Query Performance Optimization',
                'content' => 'Database optimization is a key skill for senior developers. Indexing, caching, and query optimization are essential for performance.',
                'category' => 'Performance'
            ],

            // HRMS related
            [
                'title' => 'Employee Search in HRMS Pro',
                'content' => 'HRMS Pro implements advanced search capabilities for employees using full-text indexes on name, email, and employee code.',
                'category' => 'HRMS'
            ],
            [
                'title' => 'Announcement Search System',
                'content' => 'Announcements can be searched efficiently using full-text indexes for quick results on title and content.',
                'category' => 'HRMS'
            ],
            [
                'title' => 'Search Demo in HRMS Pro',
                'content' => 'This search demo showcases the power of full-text search compared to traditional LIKE queries in HRMS Pro.',
                'category' => 'HRMS'
            ],
        ];

        // Insert multiple records with variations
        for ($i = 0; $i < 10; $i++) {
            foreach ($data as $item) {
                DB::table('search_demo_records')->insert([
                    'title' => $item['title'] . ($i > 0 ? ' - Part ' . ($i + 1) : ''),
                    'content' => $item['content'] . ' This is additional context for search demonstration purposes.',
                    'category' => $item['category'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
};
