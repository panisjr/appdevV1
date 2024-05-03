import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Book } from '../model/book.model';
import { Borrowing } from '../model/borrowing.model';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private bookApiUrl = 'http://localhost:8000/api/books';
  private borrowingApiUrl = 'http://localhost:8000/api/borrow';

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

  borrowBook(bookId: number, userId: number): Observable<any> {
    const borrowData = { book_id: bookId, user_id: userId };
    return this.http.post<any>(this.borrowingApiUrl, borrowData);
  }

}
