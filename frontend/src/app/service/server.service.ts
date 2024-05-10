import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../model/book.model';
import { Borrowing } from '../model/borrowing.model';

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private bookApiUrl = 'http://localhost:8000/api/books';
  private borrowingApiUrl = 'http://localhost:8000/api';
  private apiUrl = 'http://127.0.0.1:8000/api';
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

  deleteBook(id: number, book: any): Observable<any> {
    return this.http.delete<any>(`${this.bookApiUrl}/${id}`, book);
  }

  // Borrowings API

  borrowBook(bookId: number, userId: number, return_date: string): Observable<any> {
    const borrowData = { book_id: bookId, user_id: userId , return_date: return_date};
    return this.http.post<any>(`${this.borrowingApiUrl}/borrow-book`, borrowData);
  }

  getBorrowings(): Observable<Borrowing[]> {
    return this.http.get<Borrowing[]>(`${this.borrowingApiUrl}/borrow`);
  }

  returnBook(borrowingId: number): Observable<any> {
    const returnData = { borrowing_id: borrowingId };
    return this.http.post<any>(`${this.borrowingApiUrl}/return-book`, returnData);
  }
  // Accounts API
  get() {
    return this.http.get(`${this.apiUrl}/getUsers`);
  }
  getTotalAccounts(): Observable<any> {
    return this.http.get<{ totalAccounts: number, totalBooks: number }>(`${this.apiUrl}/getTotalAccounts`);
  }
  getTodayRegisteredUsersCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/users/todayRegisteredUsersCount`);
  }
  getTodayRegisteredBooksCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/users/todayRegisteredBooksCount`);
  }
  //To get the today borrowed books count
  getTodayBorrowedBooksCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/books/todayBorrowedBooksCount`);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
  updateUser(userId: number, data: any) {
    return this.http.put(
      `${this.apiUrl}/updateUser/${userId}`,
      data
    );
  }
  deleteUser(userId: number, data: any) {
    return this.http.delete(`${this.apiUrl}/deleteUser/${userId}`, data);
  }
  deactivate(userId: number, data: any) {
    return this.http.post(`${this.apiUrl}/deactivate/${userId}`, data);
  }
  sendPasswordResetLink(data: any) {
    return this.http.post(`${this.apiUrl}/sendPasswordResetLink`, data);
  }

  // History
  history(actionType: string, userId: number, accountID: number, accountFirst: string, accountLast: string, accountRole: string): Observable<any> {
    const payload = { action: actionType, user_id: userId, accountID: accountID, accountFirst: accountFirst, accountLast: accountLast, accountRole: accountRole };
    console.log(payload);
    return this.http.post<any>(`${this.apiUrl}/history`, payload);
  }
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getHistory`);
  }
  deleteHistory(historyID: number) {
    return this.http.delete(`${this.apiUrl}/deleteHistory/${historyID}`);
  }
  deleteAllHistory(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAllHistory`)
  }
}