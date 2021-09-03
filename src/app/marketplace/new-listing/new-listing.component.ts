import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { 
  NgbTimeStruct,
  NgbCalendar,
  NgbDateStruct,
  NgbInputDatepickerConfig
 } from '@ng-bootstrap/ng-bootstrap';
 import { FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css']
})
export class NewListingComponent implements OnInit {

  currentUser;
  listingDetailsForm;
  expressedDate;
  maxDate = Date.now();

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public configDatePicker: NgbInputDatepickerConfig,

  ) { 

     // setting datepicker popup to close only on click outside
     configDatePicker.autoClose = 'outside';
    
  }

  ngOnInit(): void {
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
        }
    });
    this.listingDetailsForm = new FormGroup({
      milkType: new FormControl('', Validators.required),
      expressedDate: new FormControl({year: 2020, month: 1, day: 1}, Validators.required),
      numberOfPacks: new FormControl("", Validators.required),
      volPerPack: new FormControl("", Validators.required),
      additionalComments: new FormControl("", Validators.required)
    });
  }

  get MilkType() { return this.listingDetailsForm.get('milkType') }

  onNextButtonClick() {
    
  }
}
