import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-returned-books',
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.css'
})
export class ReturnedBooksComponent implements OnInit {
  calendarForm!: FormGroup;
  currentYear!: number;
  currentMonth!: number;
  daysInMonth: number[] = [];

  constructor(private formBuilder: FormBuilder) {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth();
  }

  ngOnInit() {
    this.generateCalendar();
    this.calendarForm = this.formBuilder.group({
      returnDate: ['', Validators.required]
    });
  }

  generateCalendar() {
    const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      this.daysInMonth.push(i);
    }
  }

  onSubmit() {
    if (this.calendarForm.valid) {
      console.log('Selected return date:', this.calendarForm.value.returnDate);
      // You can handle further processing here
    } else {
      console.log('Please select a return date within the current month.');
    }
  }
}
