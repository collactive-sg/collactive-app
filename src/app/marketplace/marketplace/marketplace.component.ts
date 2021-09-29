import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { SortFilterPageComponent } from '../sort-filter-page/sort-filter-page.component';

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
    private modalService: NgbModal
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

  openFilterPage() {
    this.modalService.open(SortFilterPageComponent);
  }
}
