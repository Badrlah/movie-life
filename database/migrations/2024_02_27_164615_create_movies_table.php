<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table){
            $table->id();
            $table->integer('reference');
            $table->string('title');
            $table->string('year');
            $table->string('poster');
            $table->string('langue');
            $table->string('overview');
            $table->json('genre');
            $table->string('vote');
            $table->string('like')->default(0);
            $table->boolean('watched')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
