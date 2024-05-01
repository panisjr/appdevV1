import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
