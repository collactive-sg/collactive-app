import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { 
  NgbInputDatepickerConfig
 } from '@ng-bootstrap/ng-bootstrap';
 import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListingService } from 'src/app/service/listing/listing.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css']
})
export class NewListingComponent implements OnInit {

  currentUser;
  currentUserDetails;
  childrenDetails;
  isEmailVerified = true;
  isEmailVerificationSent = false;
  isCompleteProfile = true;

  listingDetailsForm;
  expressedDate;
  maxDate = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  }

  constructor(
    private auth: AuthService,
    private userDataService: UserDataService,
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
          // check for validity of user profile
          this.isEmailVerified = this.currentUser.emailVerified;
          this.userDataService.getUserDetails(this.currentUser.uid).then(res => {
            this.currentUserDetails = res.data();
            this.userDataService.getChildren(user.uid).then(res => {
              this.childrenDetails = [];
              res.forEach(child => this.childrenDetails.push(child.data()));
              this.isCompleteProfile = this.userDataService.checkIfCompleteProfile(this.currentUserDetails.isDonor, this.currentUserDetails, this.childrenDetails);
            })
          })
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

    // additional check if user is not verified
    if (!this.isEmailVerified) {
      if (window.confirm("Your email is not verified. Please verify your email before making a listing. Would you like a email verification resent?")) {
        this.resendVerificationEmail();
        return;
      }
    } else if (!this.isCompleteProfile) {
      if (window.confirm("Your profile is not complete. Please complete your profile in profile settings before making a listing.")) {
        this.navigateToProfileSettings();
      }
      return;
    }

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

    var expressedTimestamp = new Date(this.expressedDate['year'],this.expressedDate['month']-1,this.expressedDate['day']).getTime();
    
    if (isNaN(parseInt(this.NumberOfPacks.value))) {
      window.alert("Please fill in a valid date for the Number of Packs");
      document.getElementById("numberOfPacks").style.border = "1px solid red";
      return;
    }

    if (isNaN(parseInt(this.VolPerPack.value))) {
      window.alert("Please fill in a valid date for the vol per pack");
      document.getElementById("volPerPack").style.border = "1px solid red";
      return;
    }
    
    if (expressedTimestamp > Date.now()) {
      window.alert("Please fill in a past date for the date expressed");
      document.getElementById("expressedDate").style.border = "1px solid red";
      return;
    }
    
    let dateLessThan6Months = new Date().setMonth(new Date().getMonth() - 6)

    if (expressedTimestamp < dateLessThan6Months) {
      window.alert("Please list milk expressed 6 months and less");
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

    this.listingService.addNewListing(listingData).then(res => {
      this.router.navigate([`/listing/${res}`]);
    });
  }

  // below are checks for profile validation
  navigateToProfileSettings() {
    this.router.navigate(["/profile-setup/type-setup"]);
  }

  verifyEmail() {
    this.resendVerificationEmail();
    this.redirectToSignInPage();
  }

  resendVerificationEmail() {
    this.auth.resendEmailVerification(this.currentUser);
    if (window.confirm("Would you like another email verification sent to your email?")) {
      window.alert(
        "Email verfication sent and will arrive shortly! Please chack your email for it."
      );
      this.isEmailVerificationSent = true;
    }
  }

  redirectToSignInPage() {
    window.alert("A verification email has been sent to your inbox. You will be redirected to the sign-in page. Please sign in again after verifying your email.")
    this.router.navigate(["login"]);
  }
  
  reloadPageUponEmailVerified() {
    window.location.reload();
  }
}
