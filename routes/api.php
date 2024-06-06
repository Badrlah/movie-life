<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Api\WatchlistController ;
use App\Http\Controllers\Api\UserController ;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum' ,'user'])->group(function () {
    Route::get('/user', function (Request $request) {return $request->user();});
    Route::post('/watchlist', [WatchlistController::class,'addToWatchlist']);
    Route::get('/watchlist', [WatchlistController::class,'index']);
    Route::get('/getwatched', [WatchlistController::class,'index2']);
    Route::get('/deletewatchlist/{reference}', [WatchlistController::class,'delete']);
    Route::get('/watched/{id}', [WatchlistController::class,'update']);
    Route::get('/deletewatched/{reference}', [WatchlistController::class,'delete']);
    Route::get('/details/{id}', [WatchlistController::class,'details']);
    Route::post('/addlike/{id}', [WatchlistController::class,'addlike']);
    Route::post('/removelike/{id}', [WatchlistController::class,'removeLike']);
    Route::get('/getall',[WatchlistController::class,'AfficherAll']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
   Route::get('/userslist', [UserController::class, 'index']); // Liste des utilisateurs
   Route::post('/ajouter', [UserController::class, 'create']); // Créer un nouvel utilisateur
   Route::get('/user/{id}', [UserController::class, 'show']); // Détails d'un utilisateur
   Route::put('/edit/{id}', [UserController::class, 'update']); // Mettre à jour les informations d'un utilisateur
   Route::post('/delete/{id}', [UserController::class, 'delete']); // Supprimer un utilisateur
   Route::get('/static', [UserController::class, 'statistics']);
});

Route::get('/getall',[WatchlistController::class,'AfficherAll']);
Route::get('/moviesearch',[WatchlistController::class,'moviesearch']);
Route::get('/fetch', [WatchlistController::class,'fetchMovie']);
require __DIR__.'/auth.php';
