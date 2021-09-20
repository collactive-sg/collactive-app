import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { 
  NgbInputDatepickerConfig
 } from '@ng-bootstrap/ng-bootstrap';
 import { FormGroup,  FormControl, Validators } from '@angular/forms';
import { ListingService } from 'src/app/service/listing/listing.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.css']
})
export class EditListingComponent implements OnInit {

  currentUser;
  editListingDetailsForm;
  expressedDate;
  listingData;
  listingID: string;

  maxDate = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  }

  constructor(
    private auth: AuthService,
    private listingService: ListingService,
    public configDatePicker: NgbInputDatepickerConfig,
    private route: ActivatedRoute,
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
    this.route.params.subscribe(params => {
      this.listingID = params['id']; 
    });
    this.listingService.getListingByID(this.listingID).pipe().subscribe((res:any) => {
      this.listingData = res;
console.log(this.listingData)
        if (this.listingData.donorID !== this.currentUser.uid) this.router.navigate([`listing/${this.listingID}`])
  
        this.editListingDetailsForm = new FormGroup({
          milkType: new FormControl(this.listingData.typeOfMilk, Validators.required),
          numberOfPacks: new FormControl(this.listingData.numberOfPacks, Validators.required),
          volPerPack: new FormControl(this.listingData.volumePerPack, Validators.required),
          additionalComments: new FormControl(this.listingData.additionalComments, Validators.required)
        });
        var expressedDateTimestamp = this.listingData.dateExpressed;
        this.expressedDate = {
          day: new Date(expressedDateTimestamp).getDate(),
          month: new Date(expressedDateTimestamp).getMonth() + 1,
          year: new Date(expressedDateTimestamp).getFullYear(),
        };
      

    });
  }

  get MilkType() { return this.editListingDetailsForm.get('milkType') }
  get NumberOfPacks() { return this.editListingDetailsForm.get('numberOfPacks') }
  get VolPerPack() { return this.editListingDetailsForm.get('volPerPack') }
  get AdditionalComments() { return this.editListingDetailsForm.get('additionalComments') }

  onSaveButtonClick() {
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
    
    if (isNaN(expressedTimestamp)) {
      window.alert("Please fill in a valid date for the date expressed");
      document.getElementById("expressedDate").style.border = "1px solid red";
      return;
    }

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

    this.listingService.editlisting(listingData, this.listingID);
    this.router.navigate([`/listing/${this.listingID}`]);
    
  }
}
