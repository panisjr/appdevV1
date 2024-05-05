export interface Borrowing {
    id?: number; // Optional if you're creating a new borrowing
    user_id: number;
    book_id: number;
<<<<<<< HEAD
    borrowed_at: Date;
    returned_at?: Date; // Optional if the book is returned
=======
    borrow_date: Date;
    return_date?: Date | null; // Optional if the book is returned, nullable Date type
    status: string;
>>>>>>> update
}
