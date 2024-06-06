<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Allmovie;
use App\Models\Movie;



class UserController extends Controller
{
    // Récupérer la liste des utilisateurs
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Créer un nouvel utilisateur
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',

        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),

        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }

    // Afficher les détails d'un utilisateur
    public function show($id){
        try {
            $user = User::findOrFail($id);
            return response()->json($user);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }




    // Mettre à jour les informations d'un utilisateur
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'string',
            'email' => 'email|unique:users,email,' . $id,
            'password' => 'min:6',

        ]);

        $user = User::findOrFail($id);
        $user->update($validatedData);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // Supprimer un utilisateur
    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function statistics(Request $request){
        $movies=Allmovie::count();
        $user=User::count();
        $favorite=Movie::count();

        $plusFavori = Movie::withCount('users')
                    ->orderBy('users_count', 'desc')->take(1)->first(['title']);


        $plusaimee = Allmovie::withCount('users')
            ->orderBy('users_count', 'desc')
            ->take(1)
            ->first(['original_title']);



        return  response()->json([
            'movies'=>$movies ,
            'user'=>$user,
            'favori'=>$favorite,
            'plusfavori'=>$plusFavori,
            'plusaimee'=>$plusaimee,
        ]);

    }
}
