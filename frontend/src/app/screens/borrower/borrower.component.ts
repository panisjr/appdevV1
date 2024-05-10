import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { Book } from '../../model/book.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BookdetailsComponent } from './bookdetails/bookdetails.component';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.css']
})
export class BorrowerComponent implements OnInit {
  firstname: string = '';
  totalAccounts: number = 0;
  totalBooks: number = 0;
  todayRegisteredUsersCount: number = 0;
  todayRegisteredBooksCount: number = 0;
  books: Book[] = [];

  constructor(private router: Router, private titleService: Title, private serverService: ServerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchAccounts();
    this.serverService.getTodayRegisteredUsersCount().subscribe(response => {
      this.todayRegisteredUsersCount = response.count;
    });
    this.serverService.getTodayRegisteredBooksCount().subscribe(response => {
      this.todayRegisteredBooksCount = response.count;
    });
    this.titleService.setTitle('Library | Dashboard');
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.firstname = user;
    }

    this.serverService.getBooks().subscribe(
      (books: Book[]) => {
        this.books = books;
      },
      (error) => {
        console.error('Error fetching books:', error);
      }
    );
  }

  fetchAccounts() {
    this.serverService.getTotalAccounts().subscribe(
      (response: any) => {
        this.totalAccounts = response.totalAccounts;
        this.totalBooks = response.totalBooks;
      },
      (error) => {
        console.error('Error fetching totalAccounts:', error);
      }
    );
  }

  logout() {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_info');
    sessionStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  // Method to get unique categories
  getCategoryList(): string[] {
    // Extract unique categories from the books array
    return Array.from(new Set(this.books.map(book => book.category)));
  }

  // Method to get books by category
  getBooksByCategory(category: string): Book[] {
    // Filter books based on the selected category
    return this.books.filter(book => book.category === category);
  }

  showBookDetails(book: Book): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.data = book;
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.position = { top: '-40%', left: '35%' }; // Center the dialog

    const dialogRef = this.dialog.open(BookdetailsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
