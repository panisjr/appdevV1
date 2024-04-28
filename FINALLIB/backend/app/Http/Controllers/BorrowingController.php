<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Borrowing;

class BorrowingController extends Controller
{
    public function borrow(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
        ]);

        $borrowing = Borrowing::create([
            'user_id' => $request->user_id,
            'book_id' => $request->book_id,
            'borrowed_at' => now(),
        ]);

        return response()->json($borrowing, 201);
    }

    public function return($id)
    {
        $borrowing = Borrowing::findOrFail($id);
        $borrowing->update(['returned_at' => now()]);
        
        return response()->json(null, 204);
    }
}
