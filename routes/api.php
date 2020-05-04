<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:api')->get('user/{id}', 'UserController@info');

Route::get('token/{id}', 'ApiTokenController@update');

Route::middleware('auth:api')->get('contacts', 'ContactController@index');
Route::middleware('auth:api')->post('contacts', 'ContactController@store');
Route::middleware('auth:api')->get('contact/{id}', 'ContactController@show');
Route::middleware('auth:api')->post('contact/{id}', 'ContactController@update');
Route::middleware('auth:api')->post('click', 'ClickController@track');
Route::middleware('auth:api')->post('contacts/uploadFile', 'ContactController@uploadFile');