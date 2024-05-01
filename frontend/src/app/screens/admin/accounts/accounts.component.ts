import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from '../../../service/backend.service';
import 'datatables.net-dt';
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  id: number = 0; // This for the user id
  accounts: any[] = []; // This is for storing the accounts
  editData: any[] = []; // This is for user data for editing
  firstname: string = '';
  middlename: string = ' ';
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
  constructor(
    private router: Router,
    private http: HttpClient,
    private titleService: Title,
    private backend: BackendService
  ) {}
  ngOnInit(): void {
    this.titleService.setTitle('Accounts');
    this.fetchAccounts();
  }
  fetchAccounts() {
    this.backend.get().subscribe(
      (response: any) => {
        this.accounts = response;
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.initializeDataTables();
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  initializeDataTables(): void {
    const self = this;
    $(document).ready(() => {
      this.dataTable = $('#accountTable').DataTable({
        data: this.accounts,
        columns: [
          { title: 'Id', data: 'id' },
          {
            title: 'Name',
            data: function (row) {
              let fullName = row.firstname;
              if (row.middlename && row.middlename.trim() !== 'null') {
                fullName += ' ' + row.middlename;
              }
              fullName += ' ' + row.lastname;
              return fullName;
            },
          },
          { title: 'Email', data: 'email' },
          { title: 'Contact', data: 'contact' },
          { title: 'Role', data: 'role' },
          { title: 'Status', data: 'status' },
          {
            title: '',
            defaultContent: '',
            orderable: false,
            searchable: false,
            render: function (data, type, row) {
              return `
              <div class="btn-group dropstart">
  <button type="button" class="btn" data-bs-toggle="dropdown" aria-expanded="false">
  <i class="bi bi-three-dots-vertical"></i>
  </button>
  <ul class="dropdown-menu p-2">
    <!-- Dropdown menu links -->
    <button class="btn btn-warning edit-btn me-3 mb-2" data-id="${
      row.id
    }" data-bs-toggle="modal" data-bs-target="#editAccountModal">Edit</button>
    <button class="btn btn-danger delete-btn" data-id="${
      row.id
    }" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Delete</button>
    <button class="btn deactivate-btn"
    [class.btn-success]="${row.status} === 'deactivated'" 
    [class.btn-danger]="${row.status} === 'active'"
    data-id="${row.id}" data-status="${row.status}">${
                row.status === 'deactivated' ? 'active' : 'deactivated'
              }</button>
    </ul>
  </div>
              `;
            },
          },
        ],
      });
      // Event listener for edit button
      $('#accountTable').on('click', '.edit-btn', function () {
        const accountId = $(this).data('id');
        self.setEdit(accountId);
      });

      // Event listener for delete button
      $('#accountTable').on('click', '.delete-btn', function () {
        const accountId = $(this).data('id');
        self.setDelete(accountId);
      });

      // Event listener for deactivate button
      $('#accountTable').on('click', '.deactivate-btn', function () {
        const accountId = $(this).data('id');
        const accountStatus = $(this).data('status');
        self.deactivate(accountId, accountStatus);
      });
    });
  }

  // Define the deactivate function
  deactivate(accountId: number, accountStatus: any) {
    this.loading = true;

    this.backend.deactivate(accountId, accountStatus).subscribe(
      (response: any) => {
        this.loading = false;
        this.successMessage = response.message;
        this.status = false;
        this.fetchAccounts();
        setTimeout(() => {
          this.successMessage = null;
        }, 1500);
      },
      (error) => {
        this.errorMessage = error.error.message;
      }
    );
  }
  closeModal() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  logout() {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_info');
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
        return; // Return early if passwords don't match
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
          this.errorMessage = error.message;

          setTimeout(() => {
            this.errorMessage = null;
          }, 2000);
        }
      );
    } catch (error) {
      this.loading = false;
      this.errorMessage = 'Failed to register account.';
    }
  }
  setEdit(accountId: number) {
    const account = this.accounts.find((a) => a.id === accountId);
    if (account) {
      this.firstname = account.firstname;
      this.middlename = account.middlename;
      this.lastname = account.lastname;
      this.email = account.email;
      this.contact = account.contact;
      this.role = account.role;
      this.id = account.id;
    }
  }
  // To update user Credentials
  updateUser(accountId: number) {
    this.loading = true;
    let bodyData = {
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      email: this.email,
      contact: this.contact,
      role: this.role,
    };

    this.backend.updateUser(accountId, bodyData).subscribe(
      (resultData: any) => {
        this.loading = false;
        this.successMessage = resultData.message;
        setTimeout(() => {
          this.successMessage = null;
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
  // To delete the user account
  setDelete(accountId: number) {
    const account = this.accounts.find((a) => a.id === accountId);
    if (account) {
      this.firstname = account.firstname;
      this.middlename = account.middlename;
      this.lastname = account.lastname;
      this.email = account.email;
      this.contact = account.contact;
      this.role = account.role;
      this.id = account.id;
    }
  }
  deleteUser(accountId: number) {
    this.loading = true;
    this.backend.deleteUser(accountId).subscribe(
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
