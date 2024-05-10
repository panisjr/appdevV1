import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from '../../service/server.service';
import { Borrowing } from '../../model/borrowing.model';
import { Book } from '../../model/book.model'; // Import Book model
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit, OnDestroy {
  borrowings: Borrowing[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit(): void {
    this.fetchBorrowings();
  }

  ngOnDestroy(): void {
    if ($.fn.DataTable.isDataTable('#borrowingTable')) {
      $('#borrowingTable').DataTable().destroy();
    }
  }

  fetchBorrowings(): void {
    this.serverService.getBorrowings().subscribe((data: Borrowing[]) => {
      this.borrowings = data;
      if ($.fn.DataTable.isDataTable('#borrowingTable')) {
        const dataTable = $('#borrowingTable').DataTable();
        dataTable.clear().draw();
        dataTable.rows.add(this.borrowings).draw();
      } else {
        this.initializeDataTable();
      }
    });
  }
  
  returnBook(borrowingId: number): void {
    this.serverService.returnBook(borrowingId).subscribe(
      () => {
        console.log('Book returned successfully');
        // Fetch book details to update quantity
        const borrowedBook = this.borrowings.find(borrowing => borrowing.id === borrowingId);
        if (borrowedBook) {
          this.serverService.getBook(borrowedBook.book_id).subscribe((book: Book) => {
            // Use optional chaining to safely access quantity
            book.quantity = (book.quantity ?? 0) + 1; // Increment quantity by 1
            this.serverService.updateBook(borrowedBook.book_id, book).subscribe(
              () => {
                console.log('Book quantity updated successfully');
                this.fetchBorrowings();
              },
              (error) => {
                console.error('Error updating book quantity:', error);
              }
            );
          });
        }
      },
      (error) => {
        console.error('Error returning book:', error);
      }
    );
  }

  private initializeDataTable(): void {
    $('#borrowingTable').DataTable({
      data: this.borrowings,
      columns: [
        { title: 'Book ID', data: 'book_id' },
        { title: 'Date Borrowed', data: 'borrow_date' },
        { title: 'Borrowed By', data: function (row: any){
          return row.firstname + " " + row.lastname;
        } },
        {title: 'Date Returned', data:'return_date'},
        {
          title: 'Status',
          data: function(row: any) {
            const returnDate = new Date(row.return_date);
            const currentDate = new Date();
            if (returnDate < currentDate) {
              return 'Overdue';
            } else {
              return row.status;
            }
          }
        },
        {
          title: 'Action',
          render: (data: any, type: any, row: any) => {
            return `<button class="btn btn-primary return-button" data-borrowing-id="${row.id}">Return</button>`;
          }
        }
      ]
    });
  
    $('#borrowingTable').on('click', '.return-button', (event: MouseEvent) => {
      const borrowingId = $(event.currentTarget).data('borrowing-id');
      this.returnBook(borrowingId);
    });
  }
  logout() {
    // Remove JWT token from local storage
    // Redirect to login page
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_info');
    this.router.navigate(['/login']);
  }
}