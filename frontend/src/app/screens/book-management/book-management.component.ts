import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { Book } from '../../model/book.model';

declare var $: any;

@Component({
  selector: 'app-book-management',
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.css'],
})
export class BookManagementComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  book: Book = {
    id: 0,
    title: '',
    category: '',
    genre: '',
    author: '',
    publisher: '',
    date: '',
    quantity: 0,
  };

  isEditMode = false;
  dataTable: any; //Initialize for datatable
  // For History
  accounts: any[] = []; //to get the user for us to find the current user
  bookID: number = 0; //To get the book that is being created,delete,or edit
  accountID: number = 0;
  accountFirst: string = ''; // The user's firstname who did that action
  accountLast: string = ''; //The user's lastname who did that action
  accountRole: string = ''; //The user's role who did that action

  constructor(private router: Router, private serverService: ServerService) {}

  ngOnInit(): void {
    this.fetchBooks();
  }
  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
  fetchBooks(): void {
    this.serverService.getBooks().subscribe(
      (data: Book[]) => {
        this.books = data;
        if (this.dataTable) {
          this.dataTable.destroy();
        }
        this.initializeDataTable();
        this.serverService.get().subscribe((resultData: any) => {
          this.accounts = resultData;
        });
      },
      (error) => {
        console.error('Error fetching book data', error);
      }
    );
  }

  logout() {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_info');
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
  createBook(): void {
    this.accountByID();
    this.serverService.createBook(this.book).subscribe(
      (resultData: any) => {
        this.successMessage = resultData.message;
        // To store the action in history
        const bookID = resultData.data.id;
        const accountID = this.accountID;
        const accountFirst = this.accountFirst;
        const accountLast = this.accountLast;
        const accountRole = this.accountRole;
        this.serverService
          .history(
            'Add new book.',
            bookID,
            accountID,
            accountFirst,
            accountLast,
            accountRole
          )
          .subscribe(() => {
            console.log('Action added to history successfully');
          });
        setTimeout(() => {
          this.ngOnInit();
          this.resetForm();
          this.successMessage = null;
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

  editBook(bookID: number): void {
    this.accountByID();
    this.serverService.updateBook(bookID, this.book).subscribe(
      (resultData: any) => {
        this.successMessage = resultData.message;
        const bookID = resultData.data.id;
        const accountID = this.accountID;
        const accountFirst = this.accountFirst;
        const accountLast = this.accountLast;
        const accountRole = this.accountRole;
        this.serverService
          .history(
            'Update book.',
            bookID,
            accountID,
            accountFirst,
            accountLast,
            accountRole
          )
          .subscribe(() => {
            console.log('Action added to history successfully');
          });
        setTimeout(() => {
          this.ngOnInit();
          this.resetForm();
          this.successMessage = null;
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

  deleteBook(bookID: number): void {
    this.accountByID();
    this.serverService.deleteBook(bookID,this.book).subscribe(
      (resultData: any) => {
        this.successMessage = resultData.message;
        const bookID = resultData.data.id;
        const accountID = this.accountID;
        const accountFirst = this.accountFirst;
        const accountLast = this.accountLast;
        const accountRole = this.accountRole;
        this.serverService.history('Delete book.', bookID, accountID, accountFirst,accountLast,accountRole).subscribe(()=>{
          console.log("Action added to the history successfully.")
        })
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

  isFormEmpty(): boolean {
    return !this.book.title.trim() && !this.book.author.trim();
  }
  initializeDataTable(): void {
    $(document).ready(() => {
      this.dataTable = $('#bookTable').DataTable({
        data: this.books,
        columns: [
          { title: 'ID', data: 'id' },
          { title: 'Title', data: 'title' },
          { title: 'Category', data: 'category' },
          { title: 'Genre', data: 'genre' },
          { title: 'Author', data: 'author' },
          { title: 'Publisher', data: 'publisher' },
          { title: 'Date', data: 'date' },
          { title: 'Quantity', data: 'quantity' },
          {
            title: '',
            defaultContent: '',
            orderable: false,
            searchable: false,
            render: function (data: any, type: any, row: any, meta: any) {
              return `
                <div class="btn-group dropstart">
                  <button type="button" class="btn" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-three-dots-vertical"></i>
                  </button>
                  <ul class="dropdown-menu">
                    <!-- Dropdown menu links -->
                    <button class="btn btn-warning edit-btn" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#editBookModal">Edit</button>
                    <button class="btn btn-danger delete-btn" data-id="${row.id}" data-bs-toggle="modal" data-bs-target="#deleteBookModal">Delete</button>
                  </ul>
                </div>
              `;
            },
          },
        ],
      });
      $('#bookTable').on('click', '.edit-btn', (event: any) => {
        const bookID = $(event.currentTarget).data('id'); // Use event.currentTarget to refer to the clicked button
        this.setEdit(bookID); // Call setEdit from the component
      });
      $('#bookTable').on('click', '.delete-btn', (event: any) => {
        const bookID = $(event.currentTarget).data('id'); // Use event.currentTarget to refer to the clicked button
        this.setDelete(bookID); // Call setEdit from the component
      });
    });
  }

  setEdit(bookID: number) {
    const bookf = this.books.find((a) => a.id === bookID);
    if (bookf) {
      this.book = {
        id: bookf.id,
        title: bookf.title,
        category: bookf.category,
        genre: bookf.genre,
        author: bookf.author,
        publisher: bookf.publisher,
        date: bookf.date,
        quantity: bookf.quantity,
      };
    }
  }
  setDelete(bookID: number) {
    const bookf = this.books.find((a) => a.id === bookID);
    if (bookf) {
      this.book = {
        id: bookf.id,
        title: bookf.title,
        category: bookf.category,
        genre: bookf.genre,
        author: bookf.author,
        publisher: bookf.publisher,
        date: bookf.date,
        quantity: bookf.quantity,
      };
    }
  }

  resetForm() {
    this.book = {
      id: 0,
      title: '',
      category: '',
      genre: '',
      author: '',
      publisher: '',
      date: '',
      quantity: 0,
    };
  }
}
