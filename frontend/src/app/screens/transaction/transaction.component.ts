import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
errorMessage: string | null = null;
successMessage: string | null = null;
constructor(private router: Router){}

logout(){
  sessionStorage.removeItem('user_info');
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('jwt_token');
  this.router.navigate(['/login']);
}
}
