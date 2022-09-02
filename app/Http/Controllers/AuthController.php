<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{

    public function register(Request $request)
    {
        //validacija 
        $data = $request->validate([
            'name' => 'required|string',
            //mora biti jedinstven email u users tabeli, a gleda email kolonu
            'email' => 'required|email|string|unique:users,email',
            //confirmed ukazuje da bi trebalo da postoji jos jedno polje za potvrdu lozinke
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ]);

        //ukoliko prodje validaciju moze da se pozove ova metoda, ona bi trebalo i da kreira korisnika
        //u tabeli
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        //ovde se dodaje token za registraciju
        $token = $user->createToken('auth_token')->plainTextToken;

        //i ovdavde dobijemo korisnika na frontu
        return response([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response([
                'error' => 'The provided credentials are not correct '
            ], 422);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function logout()
    {
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }
}
