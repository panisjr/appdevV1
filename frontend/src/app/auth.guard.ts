import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const jwtToken = sessionStorage.getItem('jwt_token');
    if (jwtToken) {
      return true; // Allow access to the route if the JWT token is present
    } else {
      this.router.navigate(['/login']);
      return false; // Deny access to the route if the user is not logged in
    }
  }
}
