import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from '../../service/backend.service';
import { ServerService } from '../../service/server.service';
import { Book } from '../../model/book.model';

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
  books: Book[] = []; // Use the Book interface to type the books array

  constructor(private router: Router, private titleService: Title, private backend: BackendService, private serverService: ServerService) {}

  ngOnInit(): void {
    this.fetchAccounts();
    this.backend.getTodayRegisteredUsersCount().subscribe(response => {
      this.todayRegisteredUsersCount = response.count;
    });
    this.backend.getTodayRegisteredBooksCount().subscribe(response => {
      this.todayRegisteredBooksCount = response.count;
    });
    this.titleService.setTitle('Library | Dashboard');
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.firstname = user;
    }

    // Fetch books when component initializes
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
    this.backend.getTotalAccounts().subscribe(
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
}
