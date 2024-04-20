import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;
  resetPassword() {
    this.loading = true;
    // Check if passwords match
    if (this.newPassword !== this.confirmPassword) {
      this.loading = false;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Call API to reset password
    // You would implement this logic to call your backend API to reset the password
    this.loading = false
    // Reset form fields
    this.newPassword = '';
    this.confirmPassword = '';

    // Display success message
    this.successMessage = 'Password reset successfully';
  }
}
