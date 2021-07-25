import { Component, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
  providers: [NgbInputDatepickerConfig] // add config to the component providers
})
export class BasicDetailsComponent implements OnInit {

  model: NgbDateStruct;
  basicDetailsForm: FormGroup;


  constructor(
    public configDatePicker: NgbInputDatepickerConfig,
    public calendarDatePicker: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router
    ) { 
     // setting datepicker popup to close only on click outside
     configDatePicker.autoClose = 'outside';
     this.basicDetailsForm = new FormGroup({
      dateOfBirth: new FormControl('', Validators.required),
      areaOfResidency: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['profile-setup/health-declaration']);
  }


}
