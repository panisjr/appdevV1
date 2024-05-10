<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BookController;
use App\Mail\Email;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\BorrowerController;
use App\Http\Controllers\ReturnController;

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
Route::post('/sendPasswordResetLink', [UserController::class, 'sendResetLinkEmail']);
Route::get('reset-password/{token}', [UserController::class, 'resetPassword'])->name('password.reset');

// Accounts
Route::post('/login', [UserController::class, 'login']);
Route::get('/getUsers', [UserController::class, 'getUsers']);
Route::get('/getTotalAccounts', [UserController::class, 'getTotalAccounts']);
Route::get('users/todayRegisteredUsersCount', [UserController::class, 'todayRegisteredUsersCount']);
Route::get('users/todayRegisteredBooksCount', [UserController::class, 'todayRegisteredBooksCount']);
Route::delete('/deleteUser/{id}', [UserController::class, 'deleteUser']);
Route::put('/updateUser/{id}', [UserController::class, 'updateUser']);
Route::post('/deactivate/{id}', [UserController::class, 'deactivate']);
// Books    
Route::resource('books', BookController::class);
Route::post('/borrow-book', [BorrowerController::class, 'borrowBook']);
Route::get('/borrow', [BorrowerController::class, 'index']);
Route::post('/return', [ReturnController::class, 'returnBook']);
Route::post('/return-book', [ReturnController::class, 'returnBook']);
Route::get('/books/todayBorrowedBooksCount', [BorrowerController::class, 'todayBorrowedBooksCount']);

// History
Route::post('/history', [UserController::class, 'history']);
Route::get('/getHistory', [UserController::class, 'getHistory']);
Route::delete('/deleteHistory/{id}', [UserController::class, 'deleteHistory']);
Route::delete('/deleteAllHistory', [UserController::class, 'deleteAllHistory']);