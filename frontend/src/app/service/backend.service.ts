import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/register', data, {
      responseType: 'text',
    });
  }
  updateUser(userId: number, data: any) {
    return this.http.put(
      `http://127.0.0.1:8000/api/updateUser/${userId}`,
      data
    );
  }
  deleteUser(userId: number) {
    return this.http.delete(`http://127.0.0.1:8000/api/deleteUser/${userId}`);
  }
  deactivate(userId: number, data:any){
    return this.http.post(`http://127.0.0.1:8000/api/deactivate/${userId}`,data);
  }
  sendPasswordResetLink(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/sendPasswordResetLink', data);
  }
}
