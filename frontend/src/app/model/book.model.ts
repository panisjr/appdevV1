export interface Book {
    id: number;
    title: string;
    category: string;
    genre: string;
    author: string;
    publisher: string;
    date: Date | string; // Use Date type for date
    quantity: number; // Use number type for quantity
}
