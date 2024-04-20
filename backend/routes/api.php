<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Mail\Email;
use Illuminate\Support\Facades\Mail;
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
Route::post('/deactivate/{id}', [UserController::class, 'deactivate']);
Route::post('/sendPasswordResetLink', [UserController::class, 'sendResetLinkEmail']);
Route::get('reset-password/{token}', [UserController::class, 'resetPassword'])->name('password.reset');

Route::get('/getUsers', [UserController::class, 'getUsers']);
Route::delete('/deleteUser/{id}', [UserController::class, 'deleteUser']);
Route::put('/updateUser/{id}', [UserController::class, 'updateUser']);
