import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  firstname: string = '';
  totalAccounts: number = 0;
  totalBooks: number = 0;
  todayRegisteredUsersCount: number = 0;
  todayRegisteredBooksCount: number = 0;
  todayBorrowedBooksCount: number = 0;
  constructor(
    private router: Router,
    private titleService: Title,
    private serverService: ServerService
  ) {}
  ngOnInit(): void {
    this.fetchAccounts();
    this.serverService.getTodayRegisteredUsersCount().subscribe((response) => {
      this.todayRegisteredUsersCount = response.count;
    });
    this.serverService.getTodayRegisteredBooksCount().subscribe((response) => {
      this.todayRegisteredBooksCount = response.count;
    });
    this.titleService.setTitle('Library | Dashboard');
    const userInfo = sessionStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.firstname = user;
    }
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
    // Remove JWT token from local storage
    // Redirect to login page
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_info');
    this.router.navigate(['/login']);
  }
}
