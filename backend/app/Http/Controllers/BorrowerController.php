<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Borrower;
use Carbon\Carbon;

class BorrowerController extends Controller
{
    public function index()
    {
        $borrowings = Borrower::all();
        return response()->json($borrowings, 200);
    }
    public function todayRegisteredBooksCount()
    {
        $today = Carbon::now()->toDateString();
        $count = Borrower::whereDate('borrow_date', $today)->count();
        return response()->json(['count' => $count]);
    }
    public function borrowBook(Request $request)
    {
        // Validate request data
        $request->validate([
            'user_id' => 'required|integer',
            'book_id' => 'required|integer',
            'return_date' => 'required|string',

        ]);


        // Fetch user information based on the provided user ID
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Create a new borrowing record
        $borrowing = Borrower::create([
            'user_id' => $request->user_id,
            'book_id' => $request->book_id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'borrow_date' => now(),
            'return_date' => $request->return_date,
            'status' => 'borrowed',
        ]);

        // Return a response indicating success
        return response()->json(['message' => 'Book borrowed successfully', 'borrow' => $borrowing], 200);
    }
}
