import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ListingService } from 'src/app/service/listing/listing.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  allLiveListings;
  currentUser

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.listingService.getAllLiveListings().pipe().subscribe(res => this.allLiveListings = res);
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
        }
        console.log(user.uid);
      });
  }

}
