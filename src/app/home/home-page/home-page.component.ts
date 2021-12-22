import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/service/auth/auth.service";
import { PrivateChatService } from "src/app/service/chat/private-chat.service";
import { ListingService } from "src/app/service/listing/listing.service";
import { NotificationsService } from "src/app/service/notif/notifications.service";
import { UserDataService } from "src/app/service/user-data/user-data.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
  currentUser;
  currentUserData;
  isDonor;
  isEmailVerified = true;
  isCompleteProfile = true;
  isEmailVerificationSent = false;
  childrenDetails;
  unreadMessageCount = 0;

  recentListings = [];
  currentUserListings = [];
  likedListings = [];

  notifications = [];

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
    private userDataService: UserDataService,
    private notificationService: NotificationsService,
    private chatService: PrivateChatService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getUserAuthState().onAuthStateChanged((user) => {
      if (user) {

        this.currentUser = user;
        this.isEmailVerified = this.currentUser.emailVerified;
        
        this.userDataService
          .getUserDoc(user.uid)
          .pipe()
          .subscribe((userData) => {
            this.currentUserData = userData;
            this.isDonor = userData["isDonor"];
            this.getTotalUnreadMessagesCount();
            this.userDataService.getChildren(user.uid).then((res) => {
              this.childrenDetails = [];
              res.forEach((child) => this.childrenDetails.push(child.data()));
              this.isCompleteProfile =
                this.userDataService.checkIfCompleteProfile(
                  this.isDonor,
                  this.currentUserData,
                  this.childrenDetails
                );
            });
          });

        // this.listingService
        //   .getAllLiveListings()
        //   .pipe()
        //   .subscribe((res) => {
        //     var sortedRecentListings = res.sort(
        //       (a, b) => b["dateExpressed"] - a["dateExpressed"]
        //     );
        //     for (let i = 0; i < 4; i++) {
        //       if (sortedRecentListings[i] == undefined) {
        //         break;
        //       }
        //       this.recentListings.push(sortedRecentListings[i]);
        //     }
        //   });

          this.listingService.getLikedListingIDsByUserID(this.currentUser.uid).then(listingIDs => {
            listingIDs.forEach(listingID => {
              this.listingService.getListingByID(listingID).pipe().subscribe(listing => {
                this.likedListings.push(listing);
              })
            })
          })

        this.listingService
          .getAllListingsByUser(this.currentUser.uid)
          .pipe()
          .subscribe((res) => {
            res = res.filter(listing => listing["status"] !== 'archived');
            this.currentUserListings = res;
          });

        this.notificationService
          .getNotificationsByUserID(this.currentUser.uid)
          .pipe()
          .subscribe((res) => {
            if (res) {
              this.notifications = [];
              res.forEach((notif) => {
                if (!notif["read"]) this.notifications.push(notif);
              });
            }
          });
      }
    });
  }

  goToNotificationPage() {
    return this.router.navigate(["home/notifications"]);
  }

  readAllNotifications() {
    if (this.notifications.length > 0) {
      this.notifications.forEach((notif) =>
        this.notificationService.readNotification(notif.notificationID)
      );
    }
  }

  navigateToChatrooms() {
    this.router.navigate(["chatrooms"]);
  }

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

  getTotalUnreadMessagesCount() {
    if (this.currentUser) {
      return this.chatService.getAllChatrooms(this.currentUser.uid).pipe().subscribe(chatrooms => {
        this.unreadMessageCount = 0;
        chatrooms.forEach(chatroom => {
          if (this.currentUser.uid === chatroom["members"][0]) {
            this.unreadMessageCount += chatroom["recentMsgsForDonor"];
          } else {
            this.unreadMessageCount += chatroom["recentMsgsForReceiver"];
          }
        })
      })
    }
  }
}
