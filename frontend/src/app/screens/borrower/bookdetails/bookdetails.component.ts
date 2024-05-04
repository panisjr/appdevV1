import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServerService } from '../../../service/server.service';

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css']
})
export class BookdetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<BookdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private borrowService: ServerService
  ) { }

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
  
    this.borrowService.borrowBook(this.data.id, userId).subscribe(
      () => {
        console.log('Book borrowed successfully');
        this.dialogRef.close();
      },
      (error) => {
        console.error('Error borrowing book:', error);
      }
    );
  }  

}
