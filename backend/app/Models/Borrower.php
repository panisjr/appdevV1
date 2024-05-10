<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrower extends Model
{
    use HasFactory;

    protected $table = 'borrower'; // Assuming 'borrower' is the name of your table
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'firstname',
        'lastname',
        'book_id',
        'borrow_date',
        'return_date',
        'status',
    ];

    // Define relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
