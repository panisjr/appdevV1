import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import 'datatables.net-dt';
import { ServerService } from '../../../service/server.service';
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
  // For History Displaying the user
  accountID: number = 0;
  accountFirst: string = '';
  accountLast: string = '';
  accountRole: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private serverService: ServerService
  ) {}
  ngOnInit(): void {
    this.fetchAccounts();
    this.initializeDataTables();
  }
  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
  fetchAccounts() {
    this.serverService.get().subscribe(
      (response: any) => {
        this.accounts = response;
        if (this.dataTable) {
          this.dataTable.clear().rows.add(this.accounts).draw(); // Update DataTable with new data
        }
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
        columnDefs: [{ width: '5%', targets: 0 }],
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
                  <button class="btn btn-warning edit-btn me-3 mb-2" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#editAccountModal">Edit</button>
                  <button class="btn btn-danger delete-btn" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Delete</button>
                  <button class="btn deactivate-btn"
                          [ngClass]="{'btn-success': ${row.status} === 'deactivated', 'btn-danger': ${row.status} === 'active'}"
                          data-id="${row.id}" data-status="${row.status}">
                    ${row.status === 'deactivated' ? 'active' : 'deactivated'}
                  </button>
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
    this.serverService.deactivate(accountId, accountStatus).subscribe(
      (response: any) => {
        this.loading = false;
        this.successMessage = response.message;
        this.status = false;
        this.fetchAccounts();
        setTimeout(() => {
          this.successMessage = null;
        }, 2000);
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
    sessionStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
  accountByID() {
    const id = Number(sessionStorage.getItem('user_id'));
    const account = this.accounts.find((a) => a.id === id);
    if (account) {
      this.accountID = account.id;
      this.accountFirst = account.firstname;
      this.accountLast = account.lastname;
      this.accountRole = account.role;
    }
  }
  register() {
    this.loading = true;
    try {
      // Call accountByID() to retrieve account information
      this.accountByID();
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
        }, 2000);
        return; // Return early if passwords don't match
      }
      this.serverService.register(bodyData).subscribe(
        (resultData: any) => {
          this.loading = false;
          this.successMessage = resultData.message;
          const userID = resultData.data?.id;
          const accountID = this.accountID;
          const accountFirst = this.accountFirst;
          const accountLast = this.accountLast;
          const accountRole = this.accountRole;
          this.serverService
            .history(
              'Add new account.',
              userID,
              accountID,
              accountFirst,
              accountLast,
              accountRole
            )
            .subscribe(() => {
              console.log('Action added to history successfully');
            });
          setTimeout(() => {
            this.successMessage = null;
            this.fetchAccounts();
            this.resetForm();
          }, 2000);
        },
        (error) => {
            this.loading = false;
            this.errorMessage = error.error.message;
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
    this.accountByID();
    let bodyData = {
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      email: this.email,
      contact: this.contact,
      role: this.role,
    };

    this.serverService.updateUser(accountId, bodyData).subscribe(
      (resultData: any) => {
        this.loading = false;
        this.successMessage = resultData.message;
        const userID = resultData.data.id;
        const accountID = this.accountID;
        const accountFirst = this.accountFirst;
        const accountLast = this.accountLast;
        const accountRole = this.accountRole;
        this.serverService
          .history(
            'Update user account.',
            userID,
            accountID,
            accountFirst,
            accountLast,
            accountRole
          )
          .subscribe(() => {
            console.log('Action added to history successfully');
          });
        setTimeout(() => {
          this.successMessage = null;
          this.fetchAccounts();
        }, 2000);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null; // Set errorMessage to null after 2 seconds
        }, 2000);
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
    this.accountByID();
    let bodyData = {
      id: this.id,
      firstname: this.firstname,
      middlename:this.middlename,
      lastname: this.lastname,
      email: this.email,
      contact: this.contact,
      role: this.role
    }
    this.serverService.deleteUser(accountId,bodyData).subscribe(
      (resultData: any) => {
        this.loading = false;
        this.successMessage = resultData.message;
        // To store in history
        const userID = resultData.data.id;
        const accountID = this.accountID;
        const accountFirst = this.accountFirst;
        const accountLast = this.accountLast;
        const accountRole = this.accountRole;
        this.serverService
          .history(
            'Delete user account.',
            userID,
            accountID,
            accountFirst,
            accountLast,
            accountRole
          )
          .subscribe(() => {
            console.log('Action added to history successfully');
          });
        setTimeout(() => {
          this.successMessage = null;
          this.resetForm();
          this.fetchAccounts();
        }, 2000);
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null;
        }, 2000);
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
