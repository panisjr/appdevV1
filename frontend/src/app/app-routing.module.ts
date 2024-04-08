import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './screens/login/login.component';
import { AdminComponent } from './screens/admin/admin.component';
import { BorrowerComponent } from './screens/borrower/borrower.component';
import { LibrarianComponent } from './screens/librarian/librarian.component';
import { RegisterComponent } from './screens/register/register.component';
import { StudentComponent } from './student/student.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Library | Login' },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Library | Register',
  },
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Library | Admin',
  },
  {
    path: 'librarian',
    component: LibrarianComponent,
    title: 'Library | Librarian',
  },
  { path: 'borrower', component: BorrowerComponent, title: 'Library' },
  { path: 'student', component: StudentComponent, title: 'Library' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
