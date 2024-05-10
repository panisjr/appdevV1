<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Borrower;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        return Book::all();
    }
    public function todayBorrowedBooksCount() 
    {
        $today = Carbon::now()->toDateString();
        $count = Borrower::whereDate('created_at', $today)->count();
        return response()->json(['count' => $count]);
    }
    public function store(Request $request)
    {
        $book = Book::create($request->all());
        return response()->json([
            'status' => true,
            'message' => 'Book Added Successfully!',
            'data' => $book
        ], 200);
    }

    public function show($id)
    {
        return Book::find($id);
    }

    public function update(Request $request, $id)
    {
        $book = Book::find($id);
        $book->update($request->all());
        return response()->json([
            'status' => true,
            'message' => 'Book Update Successfully!',
            'data' => $book
        ], 200);
    }

    public function destroy($id)
    {   $bookf = Book::find($id);
       $book = Book::destroy($id);
        return response()->json([
            'status' => true,
            'message' => 'Book Deleted Successfully!',
            'data'=> $bookf
        ], 200);
    }
}
