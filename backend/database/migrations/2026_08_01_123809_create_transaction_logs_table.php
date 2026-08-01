<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transaction_logs', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_name');
            $table->string('status'); // success, failed, rolled_back
            $table->json('operations');
            $table->text('error_message')->nullable();
            $table->decimal('execution_time', 10, 4);
            $table->boolean('is_transactional')->default(true);
            $table->string('user_id')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['transaction_name']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('transaction_logs');
    }
};
