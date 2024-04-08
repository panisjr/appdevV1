import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private httpClient: HttpClient) {}
  register(userData: object) {
    return this.httpClient.post('http://127.0.0.1:8000/api/account', userData);
  }
}
