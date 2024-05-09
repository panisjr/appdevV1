import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from '../../service/server.service';
import { Borrowing } from '../../model/borrowing.model';
import { Book } from '../../model/book.model'; // Import Book model
import { Router } from '@angular/router';

declare var $: any;

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
