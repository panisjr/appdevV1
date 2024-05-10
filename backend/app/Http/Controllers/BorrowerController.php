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
        $request->validate([
            'user_id' => 'required|integer',
            'book_id' => 'required|integer',
        ]);

        $borrowing = Borrower::create([
            'user_id' => $request->user_id,
            'book_id' => $request->book_id,
            'borrow_date' => now(),
            'status' => 'borrowed',
        ]);

        return response()->json(['message' => 'Book borrowed successfully', 'borrow' => $borrowing], 200);
    }

}

