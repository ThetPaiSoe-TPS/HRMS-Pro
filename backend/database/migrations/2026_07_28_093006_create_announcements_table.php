<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->string('summary')->nullable();
            $table->enum('type', ['general', 'hr', 'payroll', 'event', 'policy', 'emergency'])->default('general');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_important')->default(false);
            $table->enum('target_type', ['all', 'department', 'role', 'specific'])->default('all');
            $table->unsignedBigInteger('target_id')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->index(['status', 'published_at']);
            $table->index(['target_type', 'target_id']);
            $table->index('is_pinned');
            $table->index('is_important');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
