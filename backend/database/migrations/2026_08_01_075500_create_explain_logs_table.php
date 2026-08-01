<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('explain_logs', function (Blueprint $table) {
            $table->id();
            $table->text('query');
            $table->json('explain_result');
            $table->decimal('execution_time', 10, 4);
            $table->integer('row_count')->default(0);
            $table->string('connection', 50)->default('mysql');
            $table->string('user_id')->nullable();
            $table->string('route')->nullable();
            $table->timestamps();

            $table->index(['created_at']);
            $table->index(['user_id']);
            $table->index(['execution_time']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('explain_logs');
    }
};
