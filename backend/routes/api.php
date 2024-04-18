<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::apiResource('/register', UserController::class)->only([
    'store' // You can limit the routes to only those needed for registration
]);
Route::post('/login', [UserController::class, 'login']);
Route::get('/getUsers', [UserController::class, 'getUsers']);
Route::delete('/deleteUser/{id}', [UserController::class, 'deleteUser']);
Route::put('/updateUser/{id}', [UserController::class, 'updateUser']);
