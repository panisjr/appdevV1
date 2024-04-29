import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from '../../service/backend.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  firstname: string = '';
  totalAccounts: number = 0;
  totalBooks: number = 0;
  constructor(private router: Router, private titleService: Title, private backend: BackendService) {}
  ngOnInit(): void {
    this.fetchAccounts();
    this.titleService.setTitle('Library | Dashboard');
    const userInfo = sessionStorage.getItem('user_info');
    if(userInfo){
 const user = JSON.parse(userInfo);
this.firstname = user;
    }
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
    // Remove JWT token from local storage
    // Redirect to login page
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_info');
    this.router.navigate(['/login']);
  }
}
