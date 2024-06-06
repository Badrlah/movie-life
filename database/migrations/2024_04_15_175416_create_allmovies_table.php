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
        Schema::create('allmovies', function (Blueprint $table) {
            $table->integer('id')->primary()->unique()->unsigned();
            $table->timestamps();
            $table->string('original_title');
            $table->string('poster_path');
            $table->string('original_language');
            $table->text('overview')->nullable();
            $table->date('release_date');
            $table->float('vote_average');
            $table->json('genre_ids');
            $table->float('popularity');
            $table->integer('nb_like')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allmovies');
    }
};
