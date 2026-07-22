<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('positions')) {
            Schema::create('positions', function (Blueprint $table) {
                $table->id();
                $table->string('title')->unique();
                $table->text('description')->nullable();
                $table->unsignedBigInteger('department_id')->nullable();
                $table->string('salary_range')->nullable();
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->timestamps();

                $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
            });
        } else {
            Schema::table('positions', function (Blueprint $table) {
                $table->string('salary_range')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('positions');
    }
};
