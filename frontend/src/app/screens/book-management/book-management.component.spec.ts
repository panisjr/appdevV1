import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:frontend/src/app/screens/book-management/book-management.component.spec.ts
import { BookManagementComponent } from './book-management.component';

describe('BookManagementComponent', () => {
  let component: BookManagementComponent;
  let fixture: ComponentFixture<BookManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookManagementComponent);
========
import { BookdetailsComponent } from './bookdetails.component';

describe('BookdetailsComponent', () => {
  let component: BookdetailsComponent;
  let fixture: ComponentFixture<BookdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookdetailsComponent);
>>>>>>>> update:frontend/src/app/screens/borrower/bookdetails/bookdetails.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
