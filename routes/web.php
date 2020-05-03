<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
| Landing Page
*/
Route::get('/', function () {
    return view('welcome');
})->name('login')->middleware('guest');

Route::get('login', function () {
    return view('welcome');
})->middleware('guest');

Route::get('register', function () {
    return view('welcome');
})->middleware('guest');

Auth::routes();

/*
| All other urls will be handled by react router
*/
Route::get('home', function () {
    return view('welcome');
})->middleware('auth');

Route::get('contacts', function () {
    return view('welcome');
})->middleware('auth');

Route::get('contacts/{page}', function () {
    return view('welcome');
})->middleware('auth');

Route::get('contacts/create', function () {
    return view('welcome');
})->middleware('auth');

Route::get('contacts/entry/{contact}', function () {
    return view('welcome');
})->middleware('auth');
