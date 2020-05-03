<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;

class ApiTokenController extends Controller
{
    /**
     * Update the authenticated user's API token.
     *
     * @param  user id
     * @return array
     */
    public static function update($id)
    {
        $token = Str::random(60);

        $user = \App\User::findOrFail($id);

        $user->forceFill([
            'api_token' => hash('sha256', $token),
        ])->save();

        return ['token' => $token];
    }
}
