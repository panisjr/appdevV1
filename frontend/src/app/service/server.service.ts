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

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.bookApiUrl}/${id}`);
  }

  // Borrowings API

  borrowBook(borrowing: Borrowing, userId: number): Observable<Borrowing> {
    return this.http.post<Borrowing>(this.borrowingApiUrl, borrowing);
  }

  returnBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.borrowingApiUrl}/${id}`);
  }

  // Accounts API
  get(){
    return this.http.get(`${this.apiUrl}/getUsers`);
  }
  getTotalAccounts(): Observable<{ totalAccounts: number,totalBooks: number }> {
    return this.http.get<{ totalAccounts: number,totalBooks: number }>(`${this.apiUrl}/getTotalAccounts`);
  }
  getTodayRegisteredUsersCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/users/todayRegisteredUsersCount`);
  }
  getTodayRegisteredBooksCount() {
    return this.http.get<{ count: number }>(`${this.apiUrl}/users/todayRegisteredBooksCount`);
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
  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/deleteUser/${userId}`);
  }
  deactivate(userId: number, data:any){
    return this.http.post(`${this.apiUrl}/deactivate/${userId}`,data);
  }
  sendPasswordResetLink(data: any) {
    return this.http.post(`${this.apiUrl}/sendPasswordResetLink`, data);
  }

  // History
  history(actionType: string, userId: number, accountID: number,accountFirst: string,accountLast: string, accountRole: string): Observable<any> {
    const payload = { action: actionType, user_id: userId, accountID: accountID , accountFirst: accountFirst, accountLast: accountLast, accountRole: accountRole};
    console.log(payload);
    return this.http.post<any>(`${this.apiUrl}/history`,payload);
  }
  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getHistory`);
  }
  deleteHistory(historyID:number){
    return this.http.delete(`${this.apiUrl}/deleteHistory/${historyID}`);
  }
}
