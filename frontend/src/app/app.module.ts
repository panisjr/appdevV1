import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './screens/login/login.component';
import { AdminComponent } from './screens/admin/admin.component';
import { BorrowerComponent } from './screens/borrower/borrower.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  JwtHelperService,
  JwtInterceptor,
  JwtModule,
} from '@auth0/angular-jwt';
import { RegisterComponent } from './screens/register/register.component';
import { AccountsComponent } from './screens/admin/accounts/accounts.component';
import { ResetPasswordComponent } from './screens/login/reset-password/reset-password.component';
import { DataTablesModule } from 'angular-datatables';
import { BookManagementComponent } from './screens/book-management/book-management.component';
import { BookdetailsComponent } from './screens/borrower/bookdetails/bookdetails.component';
import { TransactionComponent } from './screens/transaction/transaction.component';
import { BorrowedBooksComponent } from './screens/borrowed-books/borrowed-books.component';
import { ReturnedBooksComponent } from './screens/returned-books/returned-books.component';
import { ServerService } from './service/server.service';
import { HistoryComponent } from './screens/history/history.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    BorrowerComponent,
    RegisterComponent,
    AccountsComponent,
    ResetPasswordComponent,
    BookManagementComponent,
    BookdetailsComponent,
    BorrowedBooksComponent,
    ReturnedBooksComponent,
    HistoryComponent,
    TransactionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    MatDialogModule,
    ReactiveFormsModule,//new import fo rcalendar
    MatFormFieldModule,
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
    ServerService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
