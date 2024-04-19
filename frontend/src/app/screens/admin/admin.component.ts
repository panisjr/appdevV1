import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  constructor(private router: Router, private titleService: Title) {}
  ngOnInit(): void {
    this.titleService.setTitle('Library | Dashboard');
  }
  logout() {
    // Remove JWT token from local storage
    // Redirect to login page
    localStorage.removeItem('jwt_token');
    this.router.navigate(['/login']);
  }
}