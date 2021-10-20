import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
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

  liveListings;
  currentUser;
  currentUserData;
  isDonor;
  showFilterPage:boolean = false;

  //filter attributes
  isDatePostedSortSelected:boolean = false;
  isDateExpressedSortSelected:boolean = false;
  dietaryRestrictions = [
    { name: "Halal", checked: false },
    { name: "Vegan", checked: false },
    { name: "Vegetarian", checked: false },
    { name: "Kosher", checked: false },
    { name: "Pescatarian", checked: false },
    { name: "Dairy-free", checked: false },
    { name: "Gluten-free", checked: false },
    { name: "Nut-free", checked: false },
    // { name: "Health supplements", checked: false }
  ]

  milkType:string = "";
  donorBabyAge:string = "";
  isOnHealthSupplements:boolean = false;

  @ViewChild(SortFilterPageComponent) sortFilterPage;

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
    private userDataService: UserDataService,
  ) {}

  ngOnInit(): void {
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

    this.listingService.getAllLiveListings().pipe().subscribe(res => {
        this.liveListings = res;
      });
    
  }

  openFilterPage() {

    this.showFilterPage = true;
  }

  closeFilterPage() {
    this.showFilterPage = false;
  }

  applyFilter() {
    this.isDatePostedSortSelected = this.sortFilterPage.isDatePostedSortSelected;
    this.isDateExpressedSortSelected = this.sortFilterPage.isDateExpressedSortSelected;
    this.milkType = this.sortFilterPage.milkType;
    this.donorBabyAge = this.sortFilterPage.donorBabyAge;
    this.isOnHealthSupplements = this.sortFilterPage.isOnHealthSupplements;
    this.dietaryRestrictions = this.sortFilterPage.dietaryRestrictions;
    this.filterListing();
    this.closeFilterPage()
  }

  clearFilters() {
    this.isDatePostedSortSelected = false;
    this.isDateExpressedSortSelected = false;
    this.dietaryRestrictions = [
      { name: "Halal", checked: false },
      { name: "Vegan", checked: false },
      { name: "Vegetarian", checked: false },
      { name: "Kosher", checked: false },
      { name: "Pescatarian", checked: false },
      { name: "Dairy-free", checked: false },
      { name: "Gluten-free", checked: false },
      { name: "Nut-free", checked: false },
      // { name: "Health supplements", checked: false }
    ]

    this.milkType = "";
    this.donorBabyAge= "";
    this.isOnHealthSupplements = false;
  }

  filterListing() {
    // get saved user filter pref if have
    this.listingService.getAllLiveListings().pipe().subscribe(res => {
      this.liveListings = res;

      // filter by diet
      let matchedDonorIDArray = [];
      this.userDataService.getDonorsByDietaryRestrictions(this.dietaryRestrictions, this.isOnHealthSupplements)
      .then(res => {
                  
        res.forEach(x => x.data()["userID"] !== undefined? matchedDonorIDArray.push(x.data()["userID"]): null);

        this.liveListings = this.liveListings.filter(x => matchedDonorIDArray.includes(x["donorID"]));
        
        // filter by date expressed
        if (this.isDateExpressedSortSelected) {
          this.liveListings = this.liveListings.sort((a, b) => b["dateExpressed"] - a["dateExpressed"]);
        }

        // filter by date posted
        if (this.isDatePostedSortSelected) {
          this.liveListings = this.liveListings.sort((a, b) => b["dateCreated"] - a["dateCreated"]);
        }

        // filter by milk type
        if (this.milkType) {
          this.liveListings = this.liveListings.filter(x => x["typeOfMilk"] === this.milkType);
        }

        // filter by baby age
        if (this.donorBabyAge) {
          let option = parseInt(this.donorBabyAge);
          if (isNaN(option)) return;

          let date = new Date();
          let matches = []
          if (option == 2) {
            date.setMonth(date.getMonth() - 6)
          } else if (option == 3) {
            date.setMonth(date.getMonth() - 3)
          }
          this.userDataService.getAllChildren().then(
            res => {
              res.forEach(x => {
                let day = x.data()["dateOfBirth"]["day"]
                let month = x.data()["dateOfBirth"]["month"]
                let year = x.data()["dateOfBirth"]["year"]
                let dateOfBirth= new Date()
                dateOfBirth.setDate(day)
                dateOfBirth.setMonth(month)
                dateOfBirth.setFullYear(year)
                if (option == 1 || option == 2 || option == 3) {
                  if (dateOfBirth >= date) {
                    matches.push(x.ref.parent.parent.id)
                  }
                }
              })
              this.liveListings = this.liveListings.filter(x => matches.includes(x["donorID"]));
            }
          );              
        }
      });
    })
  }
}
