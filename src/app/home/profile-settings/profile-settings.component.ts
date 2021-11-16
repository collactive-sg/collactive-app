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
  donorForm;

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
  allergens = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  currentChildID
  childrenProfiles = [];
  childProfileForm;

  constructor(public configDatePicker: NgbInputDatepickerConfig,
    public calendarDatePicker: NgbCalendar,
    private formBuilder: FormBuilder,
    public router: Router,
    private userDataService: UserDataService,
    private auth: AuthService
  ) { 
    // setting datepicker popup to close only on click outside

    this.auth.getUserAuthState()
    .onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;

        this.userDataService.getProfileImg(this.currentUser.uid).subscribe((url) => {
          this.showProfileImg(url);
        }, err => {});

        this.userDataService.getUserDoc(this.currentUser.uid).subscribe(userDoc => {
          this.isDonor = userDoc['isDonor'];
          this.donorForm = this.formBuilder.group({
            isDonor: new FormControl(userDoc['isDonor'], Validators.required),
          });

          this.firstName = userDoc['firstName'];
          this.lastName = userDoc['lastName'];
          
          if (userDoc['dateOfBirth'] !== undefined) {
            let dobDate = new Date(userDoc['dateOfBirth'])
            this.dateOfBirth = {
              day: dobDate.getDate(),
              month: dobDate.getMonth(),
              year: dobDate.getFullYear(),
            }
            this.dobString = `${this.dateOfBirth['day']}-${this.dateOfBirth['month']}-${this.dateOfBirth['year']}`;

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

          this.childrenProfiles = [];
          this.userDataService.getChildren(this.currentUser.uid).then(collection => {
            collection.docs.forEach(docu => this.childrenProfiles.push(docu.data()))
          });

        })

      } else {
        this.currentUser = ''
      }
    });
  }

  ngOnInit(): void {
  }

  convertAllergiesToString(allergies) {
    let str = "";
    allergies.forEach(element => {
      if (element.checked) {
        str = str.concat(element.name);
        str = str.concat("_ ")
      }
    });

    if (str.length == 0) {
      str = "";
    } else {
      str = str.replace(/_([^_]*)$/, '$1')
      str = str.replace(/_/g, ', ')
      str = "Allergic to ".concat(str)
    }

    return str;
  }
  
  showProfileImg(url:string) {
    const frame = document.getElementById('frame');
    if (url.length > 0) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
      document.getElementById('plus-icon').style.display = 'none';
    }
  }
}
