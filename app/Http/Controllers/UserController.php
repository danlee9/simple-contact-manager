<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function info($id)
    {
        $user = User::findOrFail($id);
        return [
            'name' => $user->name,
            'email' => $user->email
        ];
        // dd(User::findOrFail($id));
    }
}
