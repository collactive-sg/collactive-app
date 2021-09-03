import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct, NgbInputDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {

  // Current user info
  currentUser;
  firstName;
  lastName;
  isDonor: boolean;

  // Basic details
  model: NgbDateStruct;
  dateOfBirth;
  dobString;
  areaOfResidency;
  areasOptions = ["North", "East", "West", "South", "Central"];
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  lifestyleInfoForm;
  dietaryRestrictions;
  childProfiles;
  childProfileForm;

  constructor(public configDatePicker: NgbInputDatepickerConfig,
    public calendarDatePicker: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private userDataService: UserDataService,
    private auth: AuthService
  ) { 
    this.lifestyleInfoForm = this.formBuilder.group({
      isSmoker: new FormControl(true, Validators.required),
      isDrinker: new FormControl(true, Validators.required),
      isCaffeineConsumer: new FormControl(true, Validators.required),
    });

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
          this.firstName = userDoc['firstName'];
          this.lastName = userDoc['lastName'];
          
          if (userDoc['dateOfBirth'] !== undefined) {
            this.dobString = userDoc['dateOfBirth'];
            let dobArr = this.dobString.split('-');
            this.dateOfBirth = {
              day: parseInt(dobArr[0]),
              month: parseInt(dobArr[1]),
              year: parseInt(dobArr[2]),
            }
          }
          if (userDoc['areaOfResidency'] !== undefined) {
            this.areaOfResidency = this.areasOptions.indexOf(userDoc['areaOfResidency']) >= 0
              ? this.areasOptions.indexOf(userDoc['areaOfResidency']) 
              : 0;
          }
          if (userDoc['lifestyle-info'] !== undefined) {
            this.lifestyleInfoForm = this.formBuilder.group({
              isSmoker: new FormControl(userDoc['lifestyle-info']['isSmoker'], Validators.required),
              isDrinker: new FormControl(userDoc['lifestyle-info']['isDrinker'], Validators.required),
              isCaffeineConsumer: new FormControl(userDoc['lifestyle-info']['isCaffeineConsumer'], Validators.required),
            });
          }
          if (userDoc['dietary-restrictions'] !== undefined) {
            this.dietaryRestrictions = userDoc['dietary-restrictions'];
          }
        })

      } else {
        this.currentUser = ''
      }
    });
}

  ngOnInit(): void {
  }


  // get DateOfBirth() { return this.basicDetailsForm.get('dateOfBirth') }

  onDoneButtonClick() {
    let dobStr = `${this.dateOfBirth.day}-${this.dateOfBirth.month}-${this.dateOfBirth.year}`;
    this.userDataService.updateUserDoc(this.currentUser.uid, {
      'dateOfBirth' : dobStr,
      'areaOfResidency' : this.areasOptions[this.areaOfResidency],
      'dietary-restrictions': this.dietaryRestrictions
    });
    
  }

  onPrevButtonClick() {
    this.onDoneButtonClick();
    this.router.navigate(['home']);
  }

  onImgSelected(e) {
    let selectedFile = e.target.files[0];
    if (selectedFile.size > 5200000) {
      window.prompt("The image uploaded has a very high resolution. Please choose an image that is less than 5MB");
    } else {
      this.userDataService.uploadProfileImg(this.currentUser.uid, selectedFile).then(() => {
        const url = URL.createObjectURL(selectedFile);
        this.showProfileImg(url);
      }).catch(err => {
        window.prompt("We are unable to upload your picture right now. Please try again later.");
      })
    }
  }

  showProfileImg(url) {
    const frame = document.getElementById('frame');
    frame.style.backgroundImage = `url(${url})`;
    frame.style.backgroundSize = 'contain';
    document.getElementById('plus-icon').style.display = 'none';
  }
}
