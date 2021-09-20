import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-listing-page',
  templateUrl: './listing-page.component.html',
  styleUrls: ['./listing-page.component.css']
})
export class ListingPageComponent implements OnInit {
  listingID: string;
  currentUser:any;
  listingData;
  listingOwnerUID: string;
  listingOwnerDetails:any;
  listingOwnerChildren: any[];
  likedListing: any[]
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  isLiked: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private listingService: ListingService,
    private userDataService: UserDataService,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.listingID = params['id']; 
    });

   this.auth.getUserAuthState()
   .onAuthStateChanged((user) => {
     if (user) {
       this.currentUser = user;

       this.listingService.getLikedListingIDsByUserID(this.currentUser.uid).then(collection => {
        this.isLiked = collection.docs.filter(docu => docu.data().listingID === this.listingID).length !== 0 
      });
     }})
    
    this.listingService.getListingByID(this.listingID).pipe().subscribe((res:any) => {
      this.listingData = res;
      if (this.listingData == undefined) {
        this.router.navigate([`marketplace`]) 
      } else {
        this.listingOwnerUID = res.donorID;
        this.userDataService.getProfileImg(this.listingOwnerUID).pipe().subscribe(url => {       
          this.showProfileImg(url);
        });
  
        this.userDataService.getUserDetails(this.listingOwnerUID).then(res => {
          this.listingOwnerDetails = res.data();
        });
  
        this.listingOwnerChildren = [];
        this.userDataService.getChildren(this.listingOwnerUID).then(collection => {
          collection.docs.forEach(docu => this.listingOwnerChildren.push(docu.data()))
        });
      }
      
    })
  
    
  }

  showProfileImg(url) {
    const frame = document.getElementById('frame');
    frame.style.backgroundImage = `url(${url})`;
    frame.style.backgroundSize = 'contain';
  }

  convertExpressedDateTimestampToDateString() {
    if (this.listingData.dateExpressed !== undefined) {
      if(!isNaN(this.listingData.dateExpressed)) {
        return new Date(this.listingData.dateExpressed).toLocaleString('en-US').split(',')[0]
      } else {
        return "Invalid Date"
      }
    } else {
      return "Unknown Date"
    }
  }

  convertDOBToDateString() {
    if (this.listingData.dateExpressed !== undefined) { 
      let str:string = this.listingOwnerDetails.dateOfBirth;
      return str.replace(/-/g, '/');
    } else {
      return "";
    }
  }

  convertDietaryRestrictionsToString() {
    if (this.listingOwnerDetails['dietary-restrictions'] !== undefined) {
      if (this.listingOwnerDetails['dietary-restrictions'].length == 0) {
        return "None"
      } else {
        return this.listingOwnerDetails['dietary-restrictions']
                .filter(ele=> ele.checked).map(ele=>" " + ele.name);
      }
    } else {
      return "";
    }
  }

  getListingOwnerChilAllergies(child:any[]) {
    console.log(child)
    return child.filter(ele => ele.checked).map(ele=>ele.name)
  }

  likeListing() {
    this.isLiked = !this.isLiked;
    if (this.isLiked) {
      this.listingService.addLikeListing(this.currentUser.uid, this.listingID);
    } else {
      this.listingService.deleteLikeListing(this.currentUser.uid, this.listingID);
    }
  }

}
