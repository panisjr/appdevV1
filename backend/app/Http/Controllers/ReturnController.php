<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Returned;
use App\Models\Borrower;

class ReturnController extends Controller
{
    public function returnBook(Request $request)
    {
        $request->validate([
            'borrowing_id' => 'required|integer',
        ]);

        // Fetch the borrowing record
        $borrowing = Borrower::find($request->borrowing_id);

        if (!$borrowing) {
            return response()->json(['error' => 'Borrowing record not found'], 404);
        }

        // Create a new entry in the returned table
        Returned::create([
            'user_id' => $borrowing->user_id,
            'book_id' => $borrowing->book_id,
            'borrow_date' => $borrowing->borrow_date,
            'return_date' => now(),
            'status' => 'returned',
        ]);

        // Delete the record from the borrower table
        $borrowing->delete();

        return response()->json(['message' => 'Book returned successfully'], 200);
    }
}
