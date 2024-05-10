export interface Borrowing {
    id?: number; // Optional if you're creating a new borrowing
    user_id: number;
    book_id: number;
    borrow_date: Date;
    return_date: string; // Optional if the book is returned, nullable Date type
    status: string;
}
    