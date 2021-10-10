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
          this.userDataService.getUserDoc(user.uid).pipe().subscribe(userData => {
            this.currentUserData = userData;
            this.isDonor = userData['isDonor'];
          })
          this.listingService.getAllLiveListings().pipe().subscribe(res => {
            this.currentUserListings = res.filter(x => x["donorID"] === this.currentUser.uid);
            var sortedRecentListings = res.sort((a, b)=> b["dateExpressed"] - a["dateExpressed"]);
            for (let i = 0; i < 4; i++) {
              this.recentListings.push(sortedRecentListings[i]);
            }
          });
          this.notificationService.getNotificationsByUserID(this.currentUser.uid).pipe().subscribe(res => {
            if (res) {
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

}
