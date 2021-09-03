import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  allLiveListings;
  currentUser;
  currentUserData;
  isDonor;

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
    private userDataService: UserDataService,
  ) {}

  ngOnInit(): void {
    this.listingService.getAllLiveListings().pipe().subscribe(res => this.allLiveListings = res);
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          this.userDataService.getUserDoc(user.uid).pipe().subscribe(userData => {
            this.currentUserData = userData;
            this.isDonor = userData['isDonor'];
          })
        }
      });
  }

}
