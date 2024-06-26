import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  AccountArray: any[] = [];
  isResultLoaded = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  firstname: string = '';
  middlename: string = '';
  lastname: string = '';
  email: string = '';
  contact: string = '';
  role: string = 'Borrower';
  status: boolean = true;
  password: string = '';
  confirm_password: string = '';

  currentAccountID = '';

  constructor(private http: HttpClient, private serverService:ServerService) {
    this.getAllAccounts();
  }

  getAllAccounts() {
    this.http
      .get('http://127.0.0.1:8000/api/account')

      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData);
        this.AccountArray = resultData;
      });
  }

  register() {
    let bodyData = {
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      email: this.email,
      contact: this.contact,
      password: this.password,
      confirm_password: this.confirm_password,
      role: this.role,
    };
    if (this.password !== this.confirm_password) {
      this.errorMessage = "Password didn't match! Please try again.";
    }
    this.serverService
      .register(bodyData)
      .subscribe(
        (resultData: any) => {
          this.successMessage = 'Registered Successfully!';
          this.getAllAccounts();
          this.firstname = '';
          this.middlename = '';
          this.lastname = '';
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
  setUpdate(data: any) {
    this.firstname = data.firstname;
    this.middlename = data.middlename;
    this.lastname = data.lastname;
    this.email = data.email;
    this.contact = data.contact;
    this.password = data.password;
    this.confirm_password = data.confirm_password;
    this.role = data.role;
    this.currentAccountID = data.id;
  }

  UpdateRecords() {
    let bodyData = {
      id: this.currentAccountID,
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      email: this.email,
      contact: this.contact,
      password: this.password,
      confirm_password: this.confirm_password,
    };

    this.http
      .put(
        'http://127.0.0.1:8000/api/account' + '/' + this.currentAccountID,
        bodyData
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Account Registered Updated');
        this.getAllAccounts();
      });
  }

  save() {
    if (this.currentAccountID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
  }

  setDelete(data: any) {
    this.http
      .delete('http://127.0.0.1:8000/api/account' + '/' + data.id, {
        responseType: 'text',
      })
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Account Deleted');
        this.getAllAccounts();
        this.firstname = '';
        this.middlename = '';
        this.lastname = '';
        this.email = '';
        this.contact = '';
        this.password = '';
        this.confirm_password = '';
        this.role = '';
      });
  }
  closeModal() {
    this.successMessage = null;
    this.errorMessage = null;
  }
}
