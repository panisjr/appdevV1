import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerService } from '../../../service/server.service';
import { Router, NavigationStart } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css']
})
export class BookdetailsComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<BookdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private borrowService: ServerService,
    private router: Router, 
    private snackBar: MatSnackBar

  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  borrowBook(): void {
    const userIdString = sessionStorage.getItem('user_id');
    if (!userIdString) {
      console.error('User ID not found in session storage.');
      return;
    }

    const userId = parseInt(userIdString, 10);
    if (isNaN(userId)) {
      console.error('Invalid user ID:', userIdString);
      return;
    }

    if (this.data.quantity <= 0) {
      this.snackBar.open('Cannot borrow the book. Quantity is already 0.', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.borrowService.borrowBook(this.data.id, userId).subscribe(
      () => {
        console.log('Book borrowed successfully');

        this.data.quantity -= 1;

        this.borrowService.updateBook(this.data.id, this.data).subscribe(
          () => {
            console.log('Book quantity updated successfully');
            this.dialogRef.close();
          },
          (error) => {
            console.error('Error updating book quantity:', error);
          }
        );
      },
      (error) => {
        console.error('Error borrowing book:', error);
      }
    );
  }

}