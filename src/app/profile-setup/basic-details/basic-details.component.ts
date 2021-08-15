import { Component, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';



@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
  providers: [NgbInputDatepickerConfig] // add config to the component providers
})
export class BasicDetailsComponent implements OnInit {

  model: NgbDateStruct;
  basicDetailsForm: FormGroup;

  currentUser;
  isDonor = false;
  doc;

  constructor(
    public configDatePicker: NgbInputDatepickerConfig,
    public calendarDatePicker: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService
    ) { 
     // setting datepicker popup to close only on click outside
     configDatePicker.autoClose = 'outside';
     this.basicDetailsForm = new FormGroup({
      dateOfBirth: new FormControl('', Validators.required),
      areaOfResidency: new FormControl('', Validators.required)
    });

    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.doc = this.userDataService.getUserDetails(this.currentUser.uid).then(
          response => {
            this.doc = response.data();
            this.isDonor = this.doc['isDonor'];
          }
        );
      };
    });
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    if (this.isDonor) {
      this.router.navigate(['profile-setup/health-declaration']);
    } else {
      this.router.navigate(['profile-setup/child-profile']);
    }
  }


}
