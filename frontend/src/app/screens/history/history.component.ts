import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../service/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  historyID: number = 0;
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  dataTable: any;
  history: any[] = [];
  historyCount: number = 0;
  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.getHistoryEntries();
  }

  getHistoryEntries(): void {
    this.serverService.getHistory().subscribe(
      (resultData: any) => {
        this.history = resultData.history;
        this.historyCount = resultData.totalHistory;
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.initializeDataTables();
      },
      (error) => {
        console.error('Error fetching log entries:', error);
      }
    );
  }
  initializeDataTables(): void {
    const self = this;
    $(document).ready(() => {
      this.dataTable = $('#historyTable').DataTable({
        data: this.history,
        columns: [
          { title: 'ID', data: 'user_id' },
          { title: 'Decription', data: 'action_type' },
          {
            title: 'By:',
            data: function (row) {
              return row.account_first + ' ' + row.account_last;
            },
          },
          { title: 'Role', data: 'account_role' },
          { title: 'Date and Time', data: 'created_at' },
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
              <button class="btn btn-danger delete-btn" data-id="${row.id}" 
              data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Delete</button>
              </ul>
            </div>
              `;
            },
          },
        ],
      });
      $('#historyTable').on('click', '.delete-btn', function () {
        const accountID = $(this).data('id');
        self.setDelete(accountID);
      });
    });
  }
  // Delete History
  setDelete(historyID: number) {
    this.historyID = historyID;
  }
  deleteHistory(historyID: number) {
    this.serverService.deleteHistory(historyID).subscribe(
      (resultData: any) => {
        this.successMessage = resultData.message;
        setTimeout(() => {
          this.successMessage = null;
          this.ngOnInit();
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null;
        }, 2000);
      }
    );
  }
  deleteAllHistory() {
    this.serverService.deleteAllHistory().subscribe(
      (resultData: any) => {
        this.successMessage = resultData.message;
        setTimeout(() => {
          this.successMessage = null;
          this.ngOnInit();
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null;
        }, 2000);
      }
    );
  }
  logout() {
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
