export interface Borrowing {
    id?: number; // Optional if you're creating a new borrowing
    user_id: number;
    book_id: number;
    borrowed_at: Date;
    returned_at?: Date; // Optional if the book is returned
}
