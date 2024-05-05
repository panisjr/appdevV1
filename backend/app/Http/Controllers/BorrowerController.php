<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Book;
use Illuminate\Http\Request;
use App\Models\Borrower;

class BorrowerController extends Controller
{
    public function borrowBook(Request $request)
    {
        // Validate the request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
        ]);

        // Find the user and book
        $user = User::findOrFail($request->user_id);
        $book = Book::findOrFail($request->book_id);

        // Check if the book is available for borrowing
        if ($book->quantity <= 0) {
            return response()->json(['message' => 'Book is out of stock'], 400);
        }

        // Borrow the book (update quantity and record transaction)
        $book->decrement('quantity'); // Decrease book quantity
        // Record borrowing transaction (you need to implement this method)
        // This could involve creating a new model like BorrowingTransaction and storing the user_id, book_id, and borrowing date
        // You would then save the borrowing transaction record to your database
        // Example: BorrowingTransaction::create(['user_id' => $user->id, 'book_id' => $book->id, 'borrowed_at' => now()]);
        // Replace the example with your actual implementation

        // Return success response
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

        return response()->json(['message' => 'Book borrowed successfully'], 200);
    }
}
