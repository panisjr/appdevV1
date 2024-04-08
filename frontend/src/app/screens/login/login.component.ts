import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  name: string = '';
  email: string = '';
  forgotEmail: string = '';
  password: string = '';
  confirm_password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @ViewChild('exampleModal') modal: any; // Reference to the modal

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private titleService: Title
  ) {} // Inject Router

  closeModal() {
    this.errorMessage = null;
    this.successMessage = null;
    this.forgotEmail = '';
  }

  checkToken() {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      const tokenPayload = this.jwtHelper.decodeToken(token);
    }
  }

  login() {
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.http.post<any>('http://localhost:3000/login', userData).subscribe(
      (response) => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          switch (response.role) {
            case 'admin':
              this.router.navigate(['/adminDashboard']);
              break;
            case 'librarian':
              this.router.navigate(['/librarianDashboard']);
              break;
            case 'borrower':
              this.router.navigate(['/borrowerDashboard']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        }
      },
      (error) => {
        this.errorMessage = error.error.message;
        this.modal.show(); // Show the modal when error occurs
      }
    );
  }
  forgotPassword() {
    if (!this.forgotEmail) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    this.http
      .post('http://localhost:3000/forgotPassword', { email: this.forgotEmail })
      .subscribe(
        (response: any) => {
          this.errorMessage = response.message;
        },
        (error) => {
          this.errorMessage = error.error.message;
        }
      );
  }
}
