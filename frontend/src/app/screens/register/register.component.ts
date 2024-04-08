import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

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

  name: string = '';
  email: string = '';
  contact: string = '';
  password: string = '';
  confirm_password: string = '';
  role: string = '';

  currentAccountID = '';

  constructor(private http: HttpClient) {
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
      name: this.name,
      email: this.email,
      contact: this.contact,
      password: this.password,
      confirm_password: this.confirm_password,
      role: this.role,
    };

    this.http
      .post('http://127.0.0.1:8000/api/account', bodyData, {
        responseType: 'text',
      })
      .subscribe(
        (resultData: any) => {
          this.successMessage = 'Registered Successfully!';
          this.getAllAccounts();
          this.name = '';
          this.email = '';
          this.contact = '';
          this.password = '';
          this.confirm_password = '';
          this.role = '';
        },
        (error) => {
          this.errorMessage = 'Failed to register account. Please try again.';
        }
      );
  }
  setUpdate(data: any) {
    this.name = data.name;
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
      name: this.name,
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
        this.name = '';
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
