<?php

namespace App\Http\Controllers\Api;

use App\Models\Movie;
use App\Models\Allmovie;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class WatchlistController extends Controller
{
    public function addToWatchlist(Request $request)
    { // Vérifier si le film existe déjà dans la watchlist de l'utilisateur
        $user = $request->user();
        $movies = $user->movies;
        $movieExists = false;
        $watched = false;
        foreach ($movies as $movie) {
            if ($movie->reference == $request->reference) {
                $movieExists = true;
            if($movie->watched === 1) {
                $watched = true;
           }
        }
        }
        if ($watched) {
            return response()->json(['error' => 'This movie is already in watched liste'], 400);
        }
        if ($movieExists) {
            return response()->json(['error' => 'This movie is already in WatchListe'], 400);
        }
        // Si le film n'existe pas, l'ajouter à la watchlist de l'utilisateur
        $movie = new Movie();
        $movie->reference = $request->reference;
        $movie->title = $request->title;
        $movie->year = $request->year;
        $movie->poster = $request->poster;
        $movie->langue = $request->langue;
        $movie->overview = $request->overview;
        $movie->genre = $request->genre;
        $movie->vote = $request->vote;
        $movie->like = $request->like;
        $movie->save();
        $user->movies()->attach($movie->id);
        return response()->json(['movie' => $movie, 'message' => 'Film ajouté avec succès à votre watchlist']);
}

    public function index(Request $request)
    {
        $movieids = $request->user()->movies->pluck('id');
        $movies = Movie::whereIn('id', $movieids)->where('watched', 0)->get();
        $userMovies = $request->user()->Allmovies;
        return response()->json([
            'movies' => $movies,
            'movieliked'=> $userMovies
        ]);
    }

    public function delete(Request $request)
    {
        $movieids = $request->user()->movies->pluck('id');
        $movie = Movie::where('reference','=',$request->reference)->whereIn('id',$movieids)->first();
        $movie->users()->detach($request->user()->id);
        $movie->delete();
        return $movie ;
        return response()->json([
            'message'=>'this movie is deleted succefuly'
        ]);
    }

    public function update(Request $request)
    {
        $movie = Movie::findOrFail($request->id);
        $movie->watched = true;
        $movie->update();
        return response()->json(['movie' => $movie, 'message' => 'The movie has been watched']);
    }

    public function index2(Request $request)
    {
        $movieids = $request->user()->movies->pluck('id');
        $movies = Movie::whereIn('id', $movieids)->where('watched', 1)->get();

        return response()->json([
            'movies' => $movies,
        ]);
    }

    public function details(Request $request)
    {
        $movie = Movie::findOrFail($request->id);
        $movie['genre'] = json_decode($movie['genre']);

        return response()->json(['movie' => $movie, 'message' => "id of movie $request->id"]);
    }


public function fetchMovie() {

    $apiKey = '94c14418531c277ddc6fca0136c7013a';
    $pageNumber = 1;
    $allMovieData = [];

    while ($pageNumber <= 45) {
        $response = Http::get("https://api.themoviedb.org/3/discover/movie?api_key=$apiKey&page=$pageNumber");

        $data = json_decode($response->body(), true);
        // Accumulate fetched data
        foreach ($data['results'] as $movieData) {
            $existingMovie = Allmovie::find($movieData["id"]);

            // Check if the movie with the given ID already exists
            if ($existingMovie) {
                // Movie already exists, update its attributes
                $existingMovie->original_title = $movieData["original_title"];
                $existingMovie->poster_path = $movieData["poster_path"];
                $existingMovie->release_date = $movieData["release_date"];
                $existingMovie->genre_ids = json_encode($movieData["genre_ids"]);
                $existingMovie->overview = $movieData["overview"];
                $existingMovie->vote_average = $movieData["vote_average"];
                $existingMovie->original_language = $movieData["original_language"];
                $existingMovie->popularity = $movieData["popularity"];
                $existingMovie->save();
            } else {
                // Movie does not exist, create a new one
                $movie = new Allmovie();
                $movie->id = $movieData["id"];
                $movie->original_title = $movieData["original_title"];
                $movie->poster_path = $movieData["poster_path"];
                $movie->release_date = $movieData["release_date"];
                $movie->genre_ids = json_encode($movieData["genre_ids"]);
                $movie->overview = $movieData["overview"];
                $movie->vote_average = $movieData["vote_average"];
                $movie->original_language = $movieData["original_language"];
                $movie->popularity = $movieData["popularity"];
                $movie->save();
            }
        }


        $pageNumber++;
    }
    return $allMovieData;


}
public function AfficherAll(Request $request){
    $type = $request->input('type', 'all');
    if ($request->user()) {
        if ($type === 'trending') {
            $movies = Allmovie::orderBy('popularity', 'desc')
                              ->orderBy('release_date', 'desc')
                              ->paginate(20);
        } else {
            $movies = Allmovie::latest()->paginate(20);
        }
        $userMovies = $request->user()->Allmovies;
        return response()->json(['movies' => $movies , 'movieliked' => $userMovies]);
    } else {
        if ($type === 'trending') {
            $movies = Allmovie::orderBy('popularity', 'desc')
                              ->orderBy('release_date', 'desc')
                              ->paginate(20);
        } else {
            $movies = Allmovie::latest()->paginate(20);
        }
        return response()->json(['error' => 'Unauthenticated user', 'movies' => $movies]);
    }
}


public function moviesearch(Request $request) {
    if ($request->user()) {
        $searchTerm = $request->input('searchTerm');
        $movies = Allmovie::where('original_title', 'like', "%$searchTerm%")->get();
        $userMovies = $request->user()->Allmovies;
        return response()->json(['movieliked' => $userMovies,'movies' => $movies]);
    } else {
        $searchTerm = $request->input('searchTerm');
        $movies = Allmovie::where('original_title', 'like', "%$searchTerm%")->get();
        return response()->json(['error' => 'Unauthenticated user','movies' => $movies]);
    }
}




public function addlike(Request $request, $movieId) {
    $user = $request->user();
    $movie = Allmovie::find($movieId);

    if (!$movie) {
        return response()->json([
            'message' => 'Movie not found.',
        ], 404);
    }

    $existingLike = $movie->users()->where('user_id', $user->id)->exists();
    if (!$existingLike) {
        $movie->users()->attach($user->id);
        $movie->nb_like += 1;
        $movie->save();

        return response()->json([
            'message' => 'Like added successfully.',
            'nb_like' => $movie->nb_like,
        ], 200);
    }
}

public function removeLike(Request $request, $movieId){
    $user = $request->user();
    $movie = Allmovie::find($movieId);

    if (!$movie) {
        return response()->json([
            'message' => 'Movie not found.',
        ], 404);
    }
    $existingLike = $movie->users()->where('user_id', $user->id)->exists();

    if($existingLike){
        $movie->users()->detach($user->id);
        $movie->nb_like -= 1;
        $movie->save();
        return response()->json([
            'message' => 'Like removed successfully.',
            'nb_like' => $movie->nb_like,
        ], 200);
    }
}

}

