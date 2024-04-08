import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianComponent } from './librarian.component';

describe('LibrarianComponent', () => {
  let component: LibrarianComponent;
  let fixture: ComponentFixture<LibrarianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibrarianComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibrarianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
