import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {


  @Input() currentUserID;
  @Input() listingID;
  @Input() listing;
  donorFirstName;
  donorProfilePhotoUrl;
  dateExpressed;
  isLiked = false;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private listingService: ListingService,
  ) { 
      
    this.listingService.getLikedListingIDsByUserID(this.currentUserID).then(collection => {
      this.isLiked = collection.docs.filter(docu => docu.data().listingID === this.listingID).length !== 0 
    });
      
  }

  ngOnInit(): void {
    this.userDataService.getUserDoc(this.listing.donorID).pipe().subscribe(donorDoc => {
      this.donorFirstName = donorDoc['firstName'];
    });
    this.userDataService.getProfileImg(this.listing.donorID).pipe().subscribe(imgUrl => {
        this.donorProfilePhotoUrl = imgUrl;
        this.showProfileImg(imgUrl);
    }, err => {})
    this.dateExpressed = new Date(this.listing['dateExpressed']);
  }

  viewUser() {
    this.router.navigate([`/user/${this.listing.donorID}`]);
  }

  viewListing() {
    this.router.navigate([`/listing/${this.listingID}`]);
  }

  likeListing() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.listingService.addLikeListing(this.currentUserID, this.listingID);
    } else {
      this.listingService.deleteLikeListing(this.currentUserID, this.listingID);
    }
  }

  showProfileImg(url) {
    const frame = document.getElementById(`frame-${this.listingID}`);
    frame.style.backgroundImage = `url(${url})`;
    frame.style.backgroundSize = 'contain';
    document.getElementById(`profile-icon-${this.listingID}`).style.display = 'none';
  }
}
