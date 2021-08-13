import { Component, OnInit } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbInputDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { AuthService } from 'src/app/service/auth/auth.service';

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
  areaOfResidency;
  dateOfBirth = {day: 20, month:4, year:1969};
  areasOptions = ["North", "East", "West", "South", "Central"];

  constructor(
    public configDatePicker: NgbInputDatepickerConfig,
    public calendarDatePicker: NgbCalendar,
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
            if (userDoc['dateOfBirth'] !== undefined) {
              let dobArr = userDoc['dateOfBirth'].split('-');
              this.dateOfBirth = {
                day: dobArr[0],
                month: dobArr[1],
                year: dobArr[2],
              }
              //TODO CHECK ON THIS
              console.log(this.dateOfBirth);
            }
            if (userDoc['areaOfResidency'] !== undefined) {
              this.areaOfResidency = this.areasOptions.indexOf(userDoc['areaOfResidency']) >= 0
                ? this.areasOptions.indexOf(userDoc['areaOfResidency']) 
                : 0;
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

  onNextButtonClick() {
    let dobStr = `${this.dateOfBirth.day}-${this.dateOfBirth.month}-${this.dateOfBirth.year}`;
    this.userDataService.updateUserDoc(this.currentUser.uid, {
      'dateOfBirth' : dobStr,
      'areaOfResidency' : this.areasOptions[this.areaOfResidency],
    })
    this.router.navigate(['profile-setup/health-declaration']);
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
