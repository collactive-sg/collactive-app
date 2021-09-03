import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { 
  NgbTimeStruct,
  NgbCalendar,
  NgbDateStruct,
  NgbInputDatepickerConfig
 } from '@ng-bootstrap/ng-bootstrap';
 import { FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ListingService } from 'src/app/service/listing/listing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css']
})
export class NewListingComponent implements OnInit {

  currentUser;
  listingDetailsForm;
  expressedDate;
  maxDate = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  }

  constructor(
    private auth: AuthService,
    private listingService: ListingService,
    public configDatePicker: NgbInputDatepickerConfig,
    private router: Router,
  ) { 
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
      numberOfPacks: new FormControl("", Validators.required),
      volPerPack: new FormControl("", Validators.required),
      additionalComments: new FormControl("", Validators.required)
    });
  }

  get MilkType() { return this.listingDetailsForm.get('milkType') }
  get NumberOfPacks() { return this.listingDetailsForm.get('numberOfPacks') }
  get VolPerPack() { return this.listingDetailsForm.get('volPerPack') }
  get AdditionalComments() { return this.listingDetailsForm.get('additionalComments') }

  onNextButtonClick() {
    document.getElementById("milk-type-choices").style.border = "";
    document.getElementById("expressedDate").style.border = "";
    document.getElementById("numberOfPacks").style.border = "";
    document.getElementById("volPerPack").style.border = "";

    if (this.MilkType.value == "") {
      window.alert("Please fill in the type of breast milk");
      document.getElementById("milk-type-choices").style.border = "1px solid red";
      return;
    }

    if (this.expressedDate == undefined) {
      window.alert("Please fill in the date when the breast milk was expressed");
      document.getElementById("expressedDate").style.border = "1px solid red";
      return;
    }

    if (this.NumberOfPacks.value == "") {
      window.alert("Please fill in the number of packs of breast milk available");
      document.getElementById("numberOfPacks").style.border = "1px solid red";
      return;
    }

    if (this.VolPerPack.value == "") {
      window.alert("Please fill in the volume of each pack of breast milk available");
      document.getElementById("volPerPack").style.border = "1px solid red";
      return;
    }

    var expressedTimestamp = new Date(this.expressedDate['year'],this.expressedDate['month'],this.expressedDate['day']).getTime();

    var listingData = {
      donorID: this.currentUser.uid,
      dateExpressed: expressedTimestamp,
      status: "live",
      numberOfPacks: this.NumberOfPacks.value,
      volumePerPack: this.VolPerPack.value,
      dateCreated: Date.now(),
      additionalComments: this.AdditionalComments.value,
      typeOfMilk: this.MilkType.value,
    }

    var listingID = this.listingService.addNewListing(listingData);
    listingID.then(res => {
      this.router.navigate([`/listing/${res}`]);
    });
  }
}
