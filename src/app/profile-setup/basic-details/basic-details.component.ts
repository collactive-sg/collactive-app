import { Component, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbInputDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
  providers: [NgbInputDatepickerConfig] // add config to the component providers
})
export class BasicDetailsComponent implements OnInit {

  model: NgbDateStruct;
  nameForm: FormGroup;

  currentUser;

  areaOfResidency;
  dateOfBirth;
  areasOptions = ["North", "East", "West", "South", "Central"];
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  minDate = {year: 1900, month:1, day: 1};
  isDonor: boolean;
  constructor(
    public configDatePicker: NgbInputDatepickerConfig,
    private formBuilder: FormBuilder,
    private router: Router,
    private userDataService: UserDataService,
    private auth: AuthService,
    ) { 
     // setting datepicker popup to close only on click outside
      configDatePicker.autoClose = 'outside';
      this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;

          this.userDataService.getProfileImg(this.currentUser.uid).subscribe((url) => {
            this.showProfileImg(url);
          }, err => {});

          this.userDataService.getUserDoc(this.currentUser.uid).subscribe(userDoc => {
            this.isDonor = userDoc['isDonor'];
            if (userDoc['dateOfBirth'] !== undefined) {
              var dobString = userDoc['dateOfBirth'];
              let dobDate = new Date(dobString)
              this.dateOfBirth = {
                day: dobDate.getDate(),
                month: dobDate.getMonth() + 1,
                year: dobDate.getFullYear(),
              }
            }
            if (userDoc['areaOfResidency'] !== undefined) {
              this.areaOfResidency = this.areasOptions.indexOf(userDoc['areaOfResidency']) >= 0
                ? this.areasOptions.indexOf(userDoc['areaOfResidency']) 
                : 0;
            }
            if (userDoc['firstName'] !== undefined && userDoc['lastName'] !== undefined) {
              this.nameForm.setValue({firstName: userDoc['firstName'], lastName: userDoc['lastName']});
            }
          })

        } else {
          this.currentUser = ''
        }
      });

      this.nameForm = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required)
      });

  }

  ngOnInit(): void {
  }

  get FirstName() { return this.nameForm.get('firstName') }
  get LastName() { return this.nameForm.get('lastName') }
  
  onNextButtonClick() {

    if (this.FirstName.invalid && this.LastName.invalid) {
      window.alert("Please key in your first and last name.");
      document.getElementById("firstName").style.borderColor = "red";
      document.getElementById("lastName").style.borderColor = "red";
      return;

    } else if (this.FirstName.invalid) {
      window.alert("Please key in your first name");
      document.getElementById("firstName").style.borderColor = "red";
      return;

    } else if (this.LastName.invalid) {
      window.alert("Please key in your last name");
      document.getElementById("lastName").style.borderColor = "red";
      return;

    } else if (this.dateOfBirth == undefined) {
      window.alert("Please key in your date of birth");
      document.getElementById("dateOfBirth").style.borderColor = "red";
      return;

    } else if (this.areaOfResidency == undefined) {
      window.alert("Please key in your area of residency");
      document.getElementById("areaOfResidency").style.borderColor = "red";
      return;
    }

    let dobTimeStamp = new Date(this.dateOfBirth['year'], this.dateOfBirth['month'], this.dateOfBirth['day']).getTime();
    
    if (isNaN(dobTimeStamp)) {
      window.alert("Please fill in a valid date for the date of birth");
      document.getElementById("dateOfBirth").style.border = "1px solid red";
      return;
    }

    this.userDataService.updateUserDoc(this.currentUser.uid, {
      'dateOfBirth' : dobTimeStamp,
      'areaOfResidency' : this.areasOptions[this.areaOfResidency],
      'firstName': this.FirstName.value,
      'lastName': this.LastName.value
    })
    if (this.isDonor) {
      this.router.navigate(['profile-setup/health-declaration']);
    } else {
      this.router.navigate(['profile-setup/child-profile']);
    }
  }

  onImgSelected(e) {
    let selectedFile = e.target.files[0];
    if (selectedFile.size > 5200000) {
      window.alert("The image uploaded has a very high resolution. Please choose an image that is less than 5MB");
    } else {
      this.userDataService.uploadProfileImg(this.currentUser.uid, selectedFile).then(() => {
        const url = URL.createObjectURL(selectedFile);
        this.showProfileImg(url);
      }).catch(err => {
        window.alert("We are unable to upload your picture right now. Please try again later.");
      })
    }
  }

  showProfileImg(url) {
    const frame = document.getElementById('frame');
    frame.style.backgroundImage = `url(${url})`;
    frame.style.backgroundSize = `cover`;
    document.getElementById('plus-icon').style.display = 'none';
  }
}
