export interface Book {
    id: number | null;
    title: string;
    category: string;
    author: string;
    publisher: string;
    date: Date | string; // Use Date type for date
    quantity: number | null; // Use number type for quantity
}
