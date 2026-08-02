<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cache_logs', function (Blueprint $table) {
            $table->id();
            $table->string('key');
            $table->string('query');
            $table->decimal('without_cache_time', 10, 4);
            $table->decimal('with_cache_time', 10, 4);
            $table->integer('result_count');
            $table->boolean('cache_hit')->default(false);
            $table->string('user_id')->nullable();
            $table->timestamps();

            $table->index(['key', 'created_at']);
            $table->index(['cache_hit']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cache_logs');
    }
};
