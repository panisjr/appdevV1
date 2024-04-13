import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent {
  accounts: any[] = [];
  name: string = '';
  role: string = '';
  email: string = '';
  contact: string = '';
  password: string = '';
  confirm_password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  @ViewChild('exampleModal') modal: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Library | Accounts');
    this.fetchAccounts();
  }
  closeModal() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  fetchAccounts() {
    // Make HTTP GET request to backend API to fetch accounts
    this.http.get<any[]>('http://127.0.0.1:8000/api/register').subscribe(
      (response) => {
        this.accounts = response; // Assign fetched accounts to component property
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }

  register() {
    let bodyData = {
      name: this.name,
      email: this.email,
      contact: this.contact,
      password: this.password,
      confirm_password: this.confirm_password,
      role: this.role,
    };
    if (this.password !== this.confirm_password) {
      this.errorMessage = "Password didn't match! Please try again.";
    }
    this.http
      .post('http://127.0.0.1:8000/api/register', bodyData, {
        responseType: 'text',
      })
      .subscribe(
        (resultData: any) => {
          this.successMessage = 'Registered Successfully!';
          this.name = '';
          this.email = '';
          this.contact = '';
          this.password = '';
          this.confirm_password = '';
          this.role = '';
        },
        (error) => {
          console.error('Failed to register account:', error);
        }
      );
  }

  clearFormAndErrorMessage() {
    // Clear form fields and error messages
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirm_password = '';
    this.role = '';
    this.errorMessage = '';
  }
}
