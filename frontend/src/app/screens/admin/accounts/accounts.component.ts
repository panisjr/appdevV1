import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from '../../../service/backend.service';
import { subscribeOn } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  id: number = 0; // This for the user id
  accounts: any[] = []; // This is for storing the accounts
  editData: any[] = []; // This is for user data for editing
  firstname: string = '';
  middlename: string = '';
  lastname: string = '';
  role: string = 'Borrower';
  status: boolean = true;
  email: string = '';
  contact: string = '';
  password: string = '';
  confirm_password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;
  edit: boolean = false;
  dataTable: any;
  apiData: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private titleService: Title,
    private backend: BackendService
  ) {}
  ngOnInit(): void {
    this.titleService.setTitle('Accounts');
    this.fetchAccounts();
    // Data Table
    this.http
      .get('http://jsonplaceholder.typicode.com/posts')
      .subscribe((data: any) => {
        this.apiData = data;
        this.initializeDataTable();
      });
  }

  initializeDataTable(): void {
    this.dataTable = $('#datatable').DataTable({
      data: this.apiData,
      columns: [
        { title: 'Name', data: 'firstname' },
        { title: 'Email', data: 'email' },
        { title: 'Contact', data: 'contact' },
        { title: 'Role', data: 'role' },
      ],
    });
  }

  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
  // Define the deactivate function
  deactivate(userId: number){
    this.loading = true;
    let data = {
      status: this.status

    }
    this.backend.deactivate(userId,data).subscribe(
      (response: any) => {
        this.loading = false;
    this.successMessage = response.message;
    this.status = false;
    this.fetchAccounts();
    setTimeout(() => {
      this.successMessage = null;
    }, 1500);
    },(error)=>{
      this.errorMessage = error.error.message;
    });
  }
  closeModal() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  fetchAccounts() {
    this.http
      .get('http://127.0.0.1:8000/api/getUsers')

      .subscribe((response: any) => {
        console.log(response);
        this.accounts = response;
      });
  }

  logout() {
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }

  register() {
    this.loading = true;
    try {
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
        this.loading = false;
        this.errorMessage = "Password didn't match! Please try again.";
        setTimeout(() => {
          this.errorMessage = null;
        }, 1500);
      }
      this.backend.register(bodyData).subscribe(
        (resultData: any) => {
          this.loading = false;
          this.successMessage = 'Registered Successfully!';
          setTimeout(() => {
            this.successMessage = null;
            this.fetchAccounts();
            this.resetForm();
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
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'Failed to register account.';
    }
  }
  setEdit(data: any) {
    this.firstname = data.firstname;
    this.middlename = data.middlename;
    this.lastname = data.lastname;
    this.email = data.email;
    this.contact = data.contact;
    this.role = data.role;
    this.id = data.id;
  }
  // To update user Credentials
  updateUser(userId: number) {
    this.loading = true;
    let bodyData = {
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      email: this.email,
      contact: this.contact,
      role: this.role,
    };

    this.backend.updateUser(userId, bodyData).subscribe(
      (resultData: any) => {
        this.loading = false;
        this.successMessage = 'Updated Successfully!';
        setTimeout(() => {
          this.successMessage = null;
          this.resetForm();
          this.fetchAccounts();
        }, 1500);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null; // Set errorMessage to null after 2 seconds
        }, 1500);
      }
    );
  }
  // To Delete User Account
  setDelete(data: any) {
    this.firstname = data.firstname;
    this.middlename = data.middlename;
    this.lastname = data.lastname;
    this.email = data.email;
    this.contact = data.contact;
    this.role = data.role;
    this.id = data.id;
  }
  deleteUser(userId: number) {
    this.loading = true;
    this.backend.deleteUser(userId).subscribe(
      (resultData: any) => {
        this.loading = false;
        this.successMessage = resultData.message;
        setTimeout(() => {
          this.successMessage = null;
          this.resetForm();
          this.fetchAccounts();
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
  resetForm() {
    this.firstname = '';
    this.middlename = '';
    this.lastname = '';
    this.email = '';
    this.contact = '';
    this.password = '';
    this.confirm_password = '';
  }
  clearFormAndErrorMessage() {
    // Clear form fields and error messages
    this.firstname = '';
    this.lastname = '';
    this.middlename = '';
    this.email = '';
    this.password = '';
    this.confirm_password = '';
    this.errorMessage = '';
  }
}
