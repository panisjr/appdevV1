import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  firstname: string = '';

  constructor(private router: Router, private titleService: Title) {}
  ngOnInit(): void {
    this.titleService.setTitle('Library | Dashboard');
    const userInfo = sessionStorage.getItem('user_info');
    if(userInfo){
 const user = JSON.parse(userInfo);
this.firstname = user;
    }
  }
  logout() {
    // Remove JWT token from local storage
    // Redirect to login page
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user_info');
    this.router.navigate(['/login']);
  }
}
