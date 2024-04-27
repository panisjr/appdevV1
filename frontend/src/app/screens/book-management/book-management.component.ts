import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { Book } from '../../model/book.model';

declare var $: any;

@Component({
  selector: 'app-book-management',
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.css']
})
export class BookManagementComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  book: Book = {
    id: null,
    title: '',
    category: '',
    author: '',
    publisher: '',
    date: '',
    quantity: null
  };

  isEditMode = false;

  constructor(private router: Router, private serverService: ServerService) {
    (window as any)['deleteBook'] = this.deleteBook.bind(this);
    (window as any)['editBook'] = this.editBook.bind(this);
  }

  ngOnInit(): void {
    this.fetchBooks();
  }

  ngOnDestroy(): void {
    if ($.fn.DataTable.isDataTable('#bookTable')) {
      $('#bookTable').DataTable().destroy();
    }
  }

  fetchBooks(): void {
    this.serverService.getBooks().subscribe((data: Book[]) => {
      this.books = data;
      if ($.fn.DataTable.isDataTable('#bookTable')) {
        const dataTable = $('#bookTable').DataTable();
        dataTable.clear().draw();
        dataTable.rows.add(this.books).draw();
      } else {
        this.initializeDataTable();
      }
    });
  }

  createBook(): void {
    if (this.isEditMode) {
      this.serverService.updateBook(this.book.id!, this.book).subscribe(() => {
        console.log('Book updated successfully');
        this.isEditMode = false;
        this.fetchBooks();
        this.resetForm();
      });
    } else {
      this.serverService.createBook(this.book).subscribe(() => {
        console.log('Book added successfully');
        this.fetchBooks();
        this.resetForm();
      });
    }
  }

  editBook(id: number): void {
    this.isEditMode = true; 
    const selectedBook = this.books.find(book => book.id === id);
    if (selectedBook) {
      this.book = { ...selectedBook };
    }
  }

  deleteBook(id: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.serverService.deleteBook(id).subscribe(() => {
        this.books = this.books.filter((book) => book.id !== id);
        this.fetchBooks();
      });
    }
  }

  isFormEmpty(): boolean {
    return !this.book.title.trim() && !this.book.author.trim();
  }

  private initializeDataTable(): void {
    $('#bookTable').DataTable({
      data: this.books,
      columns: [
        { data: 'title' },
        { data: 'category' },
        { data: 'author' },
        { data: 'publisher' },
        { data: 'date' },
        { data: 'quantity' },
        {
          data: null,
          render: function (data: any, type: any, row: any, meta: any) {
            return '<button class="btn btn-warning btn-sm" onclick="editBook(' + row.id + ')">Edit</button>' +
              '<button class="btn btn-danger btn-sm" onclick="deleteBook(' + row.id + ')">Delete</button>';
          }
        }
      ]
    });
  }

  private resetForm(): void {
    this.book = {
      id: null,
      title: '',
      category: '',
      author: '',
      publisher: '',
      date: '',
      quantity: null
    };
  }
}
