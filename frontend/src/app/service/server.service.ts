import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Observable } from 'rxjs';
=======
import { Observable, from } from 'rxjs';
>>>>>>> update
import { Book } from '../model/book.model';
import { Borrowing } from '../model/borrowing.model';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private bookApiUrl = 'http://localhost:8000/api/books';
<<<<<<< HEAD
  private borrowingApiUrl = 'http://localhost:8000/api/borrowings';
=======
  private borrowingApiUrl = 'http://localhost:8000/api/borrow';
>>>>>>> update

  constructor(private http: HttpClient) { }

  // Books API

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.bookApiUrl);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.bookApiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.bookApiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.bookApiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.bookApiUrl}/${id}`);
  }

<<<<<<< HEAD
  // Borrowings API

  borrowBook(borrowing: Borrowing): Observable<Borrowing> {
    return this.http.post<Borrowing>(this.borrowingApiUrl, borrowing);
  }

  returnBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.borrowingApiUrl}/${id}`);
  }
=======
  borrowBook(bookId: number, userId: number): Observable<any> {
    const borrowData = { book_id: bookId, user_id: userId };
    return this.http.post<any>(this.borrowingApiUrl, borrowData);
  }

>>>>>>> update
}
