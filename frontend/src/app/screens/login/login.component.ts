import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BackendService } from '../../service/backend.service';

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

  loading: boolean = false; // Add a boolean variable to track loading state
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @ViewChild('exampleModal') modal: any; // Reference to the modal

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
private backend: BackendService
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
    let bodyData = {
      email: this.email, // Get email from input field
      password: this.password, // Get password from input field
    };
    this.loading = true;
    this.http.post<any>('http://127.0.0.1:8000/api/login', bodyData).subscribe(
      (response) => {
        if (response && response.data && response.data.token) {
          this.loading = false;
          localStorage.setItem('jwt_token', response.data.token);
          switch (response.data.role) {
            case 'Admin':
              this.router.navigate(['/adminDashboard']);
              break;
            case 'Librarian':
              this.router.navigate(['/librarianDashboard']);
              break;
            case 'Borrower':
              this.router.navigate(['/borrowerDashboard']);
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
        } else {
          this.loading = false;
          this.errorMessage = 'Please make sure you already have an account.';
          // Handle error (e.g., display error message to user)
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.errorMessage = 'Email not found';
        } else if (error.status === 401) {
          this.errorMessage = 'Email or Password is Incorrect';
        } else {
          this.errorMessage = 'An error occurred';
        }
        this.errorMessage = 'Failed to login';
      }
    );
  }

  forgotPassword() {
    const data = {
      email: this.forgotEmail
    }
    this.loading = true;
    this.backend.sendPasswordResetLink(data).subscribe(
      () => {
        this.loading = false;
        this.successMessage = 'Password reset link sent successfully';
        setTimeout(() => {
          this.successMessage = null;
        }, 1500);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null;
        }, 1500);
      }
    );
  }
}