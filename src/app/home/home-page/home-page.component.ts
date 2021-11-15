import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { NotificationsService } from 'src/app/service/notif/notifications.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  currentUser;
  currentUserData;
  isDonor;
  isEmailVerified: boolean;
  isCompleteProfile: boolean;
  childrenDetails;

  recentListings = [];
  currentUserListings = [];

  notifications = [];

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
    private userDataService: UserDataService,
    private notificationService: NotificationsService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.auth.getUserAuthState().onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          this.isEmailVerified = this.currentUser.emailVerified;
          this.userDataService.getUserDoc(user.uid).pipe().subscribe(userData => {
            this.currentUserData = userData;
            this.isDonor = userData['isDonor'];
            this.userDataService.getChildren(user.uid).then(res => {
              this.childrenDetails = [];
              res.forEach(child => this.childrenDetails.push(child.data()));
              this.isCompleteProfile = this.checkIfCompleteProfile(this.currentUserData, this.childrenDetails);
            })
          })
          this.listingService.getAllLiveListings().pipe().subscribe(res => {
            var sortedRecentListings = res.sort((a, b)=> b["dateExpressed"] - a["dateExpressed"]);
            for (let i = 0; i < 4; i++) {
              if (sortedRecentListings[i] == undefined) {
                break;
              } 
              this.recentListings.push(sortedRecentListings[i]);
            }
          });
          this.listingService.getAllListingsByUser(this.currentUser.uid).pipe().subscribe(res => {
            this.currentUserListings = res;
          })
          this.notificationService.getNotificationsByUserID(this.currentUser.uid).pipe().subscribe(res => {
            if (res) {
              this.notifications = [];
              res.forEach(notif => {
                if (!notif['read']) this.notifications.push(notif);
              })
            }
          });
        }
      });
  }

  goToNotificationPage() {
    return this.router.navigate(['home/notifications'])
  }

  readAllNotifications() {
    if (this.notifications.length > 0) {
      this.notifications.forEach(notif => this.notificationService.readNotification(notif.notificationID));
    }

  }

  navigateToChatrooms() {
    this.router.navigate(['chatrooms']);
  }

  navigateToProfileSettings() {
    this.router.navigate(["/profile-settings"]);
  }

  resendVerificationEmail() {
    this.auth.resendEmailVerification(this.currentUser);
    window.alert("Email verfication sent and will arrive shortly! Please chack your email for it.");
  }

  checkIfCompleteProfile(userDetails, childrenDetails) {
    var firstName = userDetails["firstName"];
    var lastName = userDetails["lastName"];
    var lifestyleInfo = userDetails["lifestyle-info"];
    var dietaryPreferences = userDetails["dietary-restrictions"];
    var areaOfResidency = userDetails["areaOfResidency"];
    var dateOfBirth = userDetails["dateOfBirth"];
    if (firstName === undefined ||
      lastName === undefined || 
      lifestyleInfo === undefined || 
      dietaryPreferences === undefined || 
      areaOfResidency === undefined ||
      dateOfBirth === undefined ||
      childrenDetails === undefined) {
        console.log("here")
        return false;
      }
    if (lifestyleInfo.length < 3) {
      return false;
    }
    if (dietaryPreferences.length < 8) {
      return false;
    }
    if (childrenDetails.length < 1) {
      return false;
    }
    return true;
  }

}
