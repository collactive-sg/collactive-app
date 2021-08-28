import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // private listingService: ListingService,
  ) { 
      // document.getElementById("like-button").style.color = "#F38397";
      // this.listingService.getListingDoc(this.listingID).subscribe(userDoc => {
      //   this.dateExpressed = userDoc['dateExpressed'];
      //   var likedUsers = userDoc['likedUsers'];
      //   if (this.currentUserID in likedUsers) {
      //     this.isLiked = true;
      //   }
      // });
      
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
    console.log(this.dateExpressed);
    console.log(this.listingID);
  }

  viewUser() {
    console.log(this.donorProfilePhotoUrl);
    this.router.navigate([`/user/${this.listing.donorID}`]);
  }

  viewListing() {
    this.router.navigate([`/listing/${this.listingID}`]);
  }

  likeListing() {
    console.log(this.isLiked);
    this.isLiked = !this.isLiked;
    if(this.isLiked) {
      document.getElementById(`like-button-${this.listingID}`).style.color = "#F38397";
    } else {
      document.getElementById(`like-button-${this.listingID}`).style.color = "#F9F9F9";
    }

    // todo update be
  }

  showProfileImg(url) {
    console.log(url)
    const frame = document.getElementById(`frame-${this.listingID}`);
    frame.style.backgroundImage = `url(${url})`;
    frame.style.backgroundSize = 'contain';
    document.getElementById(`profile-icon-${this.listingID}`).style.display = 'none';
  }
}
