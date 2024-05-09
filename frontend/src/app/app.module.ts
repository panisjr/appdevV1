import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './screens/login/login.component';
import { AdminComponent } from './screens/admin/admin.component';
import { BorrowerComponent } from './screens/borrower/borrower.component';
import { LibrarianComponent } from './screens/librarian/librarian.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  JwtHelperService,
  JwtInterceptor,
  JwtModule,
} from '@auth0/angular-jwt';
import { RegisterComponent } from './screens/register/register.component';
import { AccountsComponent } from './screens/admin/accounts/accounts.component';
import { BackendService } from './service/backend.service';
import { ResetPasswordComponent } from './screens/login/reset-password/reset-password.component';
import { DataTablesModule } from 'angular-datatables';
import { BookManagementComponent } from './screens/book-management/book-management.component';
import { BookdetailsComponent } from './screens/borrower/bookdetails/bookdetails.component';
import { TransactionComponent } from './screens/transaction/transaction.component';
import { ReturnedComponent } from './screens/transaction/returned/returned.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    BorrowerComponent,
    LibrarianComponent,
    RegisterComponent,
    AccountsComponent,
    ResetPasswordComponent,
    BookManagementComponent,
    BookdetailsComponent,
    TransactionComponent,
    ReturnedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    MatDialogModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('jwt_token'),
        allowedDomains: ['example.com'], // Add the domain(s) where your API is hosted
        disallowedRoutes: [], // Add routes that should not include the JWT token
      },
    }),
  ],
  providers: [
    BackendService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
