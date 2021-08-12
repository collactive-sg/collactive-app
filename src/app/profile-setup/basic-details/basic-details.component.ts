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
      this.basicDetailsForm = new FormGroup({
        dateOfBirth: new FormControl('', Validators.required),
        areaOfResidency: new FormControl('', Validators.required)
      });

      this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = ''
        }
      })
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['profile-setup/health-declaration']);
  }

  onFileSelected(e) {
    let selectedFile = e.target.files[0];
    if (selectedFile.size > 5200000) {
      window.prompt("The image uploaded has a very high resolution. Please choose an image that is less than 5MB");
    } else {
      this.userDataService.uploadProfilePhoto(this.currentUser.uid, selectedFile).then(res => {
        const frame = document.getElementById('frame');
        const bgUrl = URL.createObjectURL(selectedFile);
        frame.style.backgroundImage = `url(${bgUrl})`;
        frame.style.backgroundSize = 'contain';
        document.getElementById('plus-icon').style.display = 'none';

      }).catch(err => {
      window.prompt("We are unable to upload your picture right now. Please try again later.");
      })
    }
  }
}
