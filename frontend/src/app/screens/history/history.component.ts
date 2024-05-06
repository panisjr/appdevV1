import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../service/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  historyID: number = 0
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  dataTable: any;
  history: any[] = [];

  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.getHistoryEntries();
  }

  getHistoryEntries(): void {
    this.serverService.getHistory().subscribe(
      (history: any) => {
        this.history = history;
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
          { title: 'User ID', data: 'user_id' },
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
              <button class="btn btn-danger delete-btn" data-id="${row.id }" 
              data-bs-toggle="modal" data-bs-target="#deleteAccountModal">Delete</button>
              </ul>
            </div>
              `;
            },
          },
        ],
      });
      $('#historyTable').on('click','.delete-btn', function(){
        const accountID = $(this).data('id');
        self.setDelete(accountID);
      });
    });
  }
  // Delete History
  setDelete(historyID:number){
    this.historyID = historyID;
  }
  deleteHistory(historyID: number){
    this.serverService.deleteHistory(historyID).subscribe(
      (response: any)=>{
        this.successMessage = response.message;
        this.ngOnInit();
        setTimeout(() => {
          this.successMessage = null;
        }, 200);
      },(error)=>{
        this.errorMessage = error.error.message;
        setTimeout(() => {
          this.errorMessage = null;
        }, 2000);
      }
    )
  }
  logout() {
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}
