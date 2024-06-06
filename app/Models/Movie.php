<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class Movie extends Model
{
    use HasFactory;
    public function users(){

        return $this->belongsToMany(User::class, 'movie_user', 'movie_id', 'user_id');

    }

}
