<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SearchDemoSeeder extends Seeder
{
    public function run()
    {
        // Check if table exists
        if (!DB::table('search_demo_records')) {
            return;
        }

        // Clear existing data
        DB::table('search_demo_records')->truncate();

        $data = [
            // Laravel
            ['title' => 'Laravel Framework Guide', 'content' => 'Laravel is a PHP framework for web artisans with elegant syntax.', 'category' => 'Laravel'],
            ['title' => 'Laravel Eloquent ORM', 'content' => 'Laravel Eloquent provides an active record implementation for working with your database.', 'category' => 'Laravel'],
            ['title' => 'Laravel Full-Text Search', 'content' => 'Laravel supports full-text search through MySQL and PostgreSQL with Scout drivers.', 'category' => 'Laravel'],

            // Database
            ['title' => 'MySQL Full-Text Index', 'content' => 'MySQL InnoDB supports full-text indexing since version 5.6 for fast text searches.', 'category' => 'Database'],
            ['title' => 'Database Indexing Strategies', 'content' => 'Database indexing is crucial for application performance and search optimization.', 'category' => 'Database'],
            ['title' => 'Inverted Index Explained', 'content' => 'Full-text search uses inverted indexes that map words to document IDs for fast retrieval.', 'category' => 'Database'],

            // Search
            ['title' => 'Full-Text Search Benefits', 'content' => 'Full-text search provides better performance than LIKE queries with relevance scoring.', 'category' => 'Search'],
            ['title' => 'Boolean Search Mode', 'content' => 'Boolean mode search allows + (must include) and - (must exclude) operators.', 'category' => 'Search'],
            ['title' => 'Natural Language Search', 'content' => 'Natural language search understands human language patterns for better results.', 'category' => 'Search'],

            // Performance
            ['title' => 'LIKE vs Full-Text Performance', 'content' => 'LIKE vs MATCH...AGAINST shows full-text is 10-100x faster on large datasets.', 'category' => 'Performance'],
            ['title' => 'Search Optimization Techniques', 'content' => 'Search optimization for large datasets using full-text indexes.', 'category' => 'Performance'],
            ['title' => 'Database Query Optimization', 'content' => 'Database optimization is a key skill for senior developers.', 'category' => 'Performance'],

            // HRMS
            ['title' => 'Employee Search in HRMS', 'content' => 'HRMS Pro uses full-text indexes for employee search on name and email.', 'category' => 'HRMS'],
            ['title' => 'Announcement Search System', 'content' => 'Announcements can be searched efficiently using full-text indexes.', 'category' => 'HRMS'],
            ['title' => 'HRMS Search Demo', 'content' => 'Search demo showcasing full-text search vs LIKE queries in HRMS Pro.', 'category' => 'HRMS'],
        ];

        // Create 100+ records
        for ($i = 0; $i < 8; $i++) {
            foreach ($data as $item) {
                DB::table('search_demo_records')->insert([
                    'title' => $item['title'] . ($i > 0 ? ' - Example ' . $i : ''),
                    'content' => $item['content'] . ' Additional search demonstration content for testing.',
                    'category' => $item['category'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
