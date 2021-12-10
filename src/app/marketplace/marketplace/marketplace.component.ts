import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PrivateChatService } from 'src/app/service/chat/private-chat.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { FilterPageComponent } from '../filter-page/filter-page.component';
import { SortPageComponent } from '../sort-page/sort-page.component';

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
  DateExpressedSortSelectedHighLow = 'DatePostedSortSelectedHighLow';
  DateExpressedSortSelectedLowHigh = 'DateExpressedSortSelectedLowHigh';
  DatePostedSortSelectedHighLow = 'DatePostedSortSelectedHighLow';
  DatePostedSortSelectedLowHigh = 'DatePostedSortSelectedLowHigh';

  sortChoice:string = '';
  showSortPage:boolean = false;
  dietaryRestrictions = [
    { name: "Halal", checked: false },
    { name: "Vegan", checked: false },
    { name: "Vegetarian", checked: false },
    { name: "Kosher", checked: false },
    { name: "Pescatarian", checked: false },
    { name: "Dairy-free", checked: false },
    { name: "Gluten-free", checked: false },
    { name: "Nut-free", checked: false },
  ]

  milkType:string = "";
  donorBabyAge:string = "";
  isOnHealthSupplements:boolean = false;
  isHealthSupplementsFilterChosen:boolean = false;
  unreadMessageCount = 0;

  @ViewChild(FilterPageComponent) FilterPage;
  @ViewChild(SortPageComponent) SortPage;

  constructor(
    public listingService: ListingService,
    private auth: AuthService,
    private userDataService: UserDataService,
    private chatService: PrivateChatService
  ) {}

  ngOnInit(): void {
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          this.userDataService.getUserDoc(user.uid).pipe().subscribe(userData => {
            this.currentUserData = userData;
            this.isDonor = userData['isDonor'];
            this.getTotalUnreadMessagesCount();
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

  openSortPage() {
    this.showSortPage = true;
  }

  closeSortPage() {
    this.showSortPage = false;
  }

  applyFilter() {
    // this.isDatePostedSortSelected = this.FilterPage.isDatePostedSortSelected;
    // this.isDateExpressedSortSelected = this.FilterPage.isDateExpressedSortSelected;
    this.milkType = this.FilterPage.milkType;
    this.donorBabyAge = this.FilterPage.donorBabyAge;
    this.isOnHealthSupplements = this.FilterPage.isOnHealthSupplements;
    this.dietaryRestrictions = this.FilterPage.dietaryRestrictions;
    this.isHealthSupplementsFilterChosen = this.FilterPage.isHealthSupplementsFilterChosen;
    this.filterListing();
    this.closeFilterPage()
  }

  applySort() {
    this.sortChoice = this.SortPage.sortChoice;
    this.sortListing();
    this.closeSortPage();
  }

  sortListing() {
    switch (this.sortChoice) {
    case this.DateExpressedSortSelectedHighLow:
      this.liveListings = this.liveListings.sort((a, b) => b["dateExpressed"] - a["dateExpressed"]);
      break;
    case this.DateExpressedSortSelectedLowHigh:
      this.liveListings = this.liveListings.sort((a, b) => a["dateExpressed"] - b["dateExpressed"]);
      break;
    case this.DatePostedSortSelectedHighLow:
      this.liveListings = this.liveListings.sort((a, b) => b["dateCreated"] - a["dateCreated"]);
      break;
    case this.DatePostedSortSelectedLowHigh:
      this.liveListings = this.liveListings.sort((a, b) => a["dateCreated"] - b["dateCreated"]);
      break;
    default:
      break;
    }
    // filter by date expressed
    // if (this.isDateExpressedSortSelected) {
    //   this.liveListings = this.liveListings.sort((a, b) => b["dateExpressed"] - a["dateExpressed"]);
    // }

    // filter by date posted
    // if (this.isDatePostedSortSelected) {
    //   this.liveListings = this.liveListings.sort((a, b) => b["dateCreated"] - a["dateCreated"]);
    // }
  }

  // clearFilters() {
  //   this.dietaryRestrictions = [
  //     { name: "Halal", checked: false },
  //     { name: "Vegan", checked: false },
  //     { name: "Vegetarian", checked: false },
  //     { name: "Kosher", checked: false },
  //     { name: "Pescatarian", checked: false },
  //     { name: "Dairy-free", checked: false },
  //     { name: "Gluten-free", checked: false },
  //     { name: "Nut-free", checked: false },
  //   ]

  //   this.milkType = "";
  //   this.donorBabyAge= "";
  //   this.isOnHealthSupplements = false;
  //   this.isHealthSupplementsFilterChosen = false;

  //   this.FilterPage.milkType = this.milkType;
  //   this.FilterPage.donorBabyAge = this.donorBabyAge;
  //   this.FilterPage.isOnHealthSupplements = this.isOnHealthSupplements;
  //   this.FilterPage.dietaryRestrictions = this.dietaryRestrictions;
  //   this.FilterPage.isHealthSupplementsFilterChosen = this.isHealthSupplementsFilterChosen;

  // }

  filterListing() {
    // get saved user filter pref if have
    this.listingService.getAllLiveListings().pipe().subscribe(res => {
      this.liveListings = res;

      // filter by diet
      let matchedDonorIDArray = [];
      this.userDataService.getDonorsByDietaryRestrictions(this.dietaryRestrictions, this.isOnHealthSupplements, this.isHealthSupplementsFilterChosen)
      .then(res => {
                  
        res.forEach(x => x.data()["userID"] !== undefined? matchedDonorIDArray.push(x.data()["userID"]): null);

        this.liveListings = this.liveListings.filter(x => matchedDonorIDArray.includes(x["donorID"]));

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
