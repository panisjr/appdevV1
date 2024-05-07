import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './screens/login/login.component';
import { AdminComponent } from './screens/admin/admin.component';
import { BorrowerComponent } from './screens/borrower/borrower.component';
import { RegisterComponent } from './screens/register/register.component';
import { AuthGuard } from './auth.guard';
import { AccountsComponent } from './screens/admin/accounts/accounts.component';
import { LibrarianComponent } from './screens/librarian/librarian.component';
import { ResetPasswordComponent } from './screens/login/reset-password/reset-password.component';
import { BookManagementComponent } from './screens/book-management/book-management.component';
import { HistoryComponent } from './screens/history/history.component';
import { TransactionComponent } from './screens/transaction/transaction.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Library | Login' },
  { path: 'register', component: RegisterComponent, title: 'Library | Register' },
  { path: 'adminDashboard', component: AdminComponent, title: 'Library | Admin', canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, title: 'Library | Accounts', canActivate: [AuthGuard] },
  { path: 'librarianDashboard', component: LibrarianComponent, title: 'Library | Librarian', canActivate: [AuthGuard] },
  { path: 'borrowerDashboard', component: BorrowerComponent, title: 'Library | Dashboard', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'books', component: BookManagementComponent, title: 'Library | Book Management', canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, title: 'Library | History', canActivate: [AuthGuard] },
  { path: 'transaction', component: TransactionComponent, title: 'Library | Transaction', canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
