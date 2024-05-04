<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBorrowerTable extends Migration
{
    public function up()
    {
        Schema::create('borrower', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Assuming user_id references the id column in the users table
            $table->unsignedInteger('book_id'); // Assuming book_id references the id column in the books table
            $table->timestamp('borrow_date')->default(now());
            $table->timestamp('return_date')->nullable();
            $table->string('status')->default('borrowed');
            $table->timestamps();

            // Define foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('borrower');
    }
}
