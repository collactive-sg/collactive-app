import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth/auth.service';
import { FilterService } from 'src/app/service/filter/filter.service';

@Component({
  selector: 'app-sort-filter-page',
  templateUrl: './sort-filter-page.component.html',
  styleUrls: ['./sort-filter-page.component.css']
})
export class SortFilterPageComponent implements OnInit {

  currentUser;
  @Input() isDatePostedSortSelected;
  @Input() isDateExpressedSortSelected;

  @Input() dietaryRestrictions = [
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

  @Input() milkType:string;
  @Input() donorBabyAge:string;
  @Input() isOnHealthSupplements:boolean;

  constructor(
    // public activeModal: NgbActiveModal,
    private auth: AuthService,
    private filterService: FilterService
    ) { }

  ngOnInit(): void {

    this.setColorOfHealthSupplements(this.isOnHealthSupplements)
    if (this.isDateExpressedSortSelected) {
      document.getElementById("date-expressed-sort").style.background = "#3B485F"
      document.getElementById("date-expressed-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-expressed-sort").style.background = "#FFFFFF"
      document.getElementById("date-expressed-sort").style.color = "#3B485F"
    }
    console.log(this.isDatePostedSortSelected)
    if (this.isDatePostedSortSelected) {
      document.getElementById("date-posted-sort").style.background = "#3B485F"
      document.getElementById("date-posted-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-posted-sort").style.background = "#FFFFFF"
      document.getElementById("date-posted-sort").style.color = "#3B485F"
    }
    this.auth.getUserAuthState().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        // this.filterService.getFilter(this.currentUser.uid).subscribe(res => {
        //   if (res.data() !== undefined) {
        //     if (res.data()["isDateExpressedSortSelected"] !== undefined) {
        //       // this.isDateExpressedSortSelected = res.data()["isDateExpressedSortSelected"];
        //       if (this.isDateExpressedSortSelected) {
        //         document.getElementById("date-expressed-sort").style.background = "#3B485F"
        //         document.getElementById("date-expressed-sort").style.color = "#FFFFFF"
        //       } else {
        //         document.getElementById("date-expressed-sort").style.background = "#FFFFFF"
        //         document.getElementById("date-expressed-sort").style.color = "#3B485F"
        //       }
        //     }

        //     if (res.data()["isDatePostedSortSelected"] !== undefined) {
        //       this.isDatePostedSortSelected = res.data()["isDatePostedSortSelected"];
        //       if (this.isDatePostedSortSelected) {
        //         document.getElementById("date-posted-sort").style.background = "#3B485F"
        //         document.getElementById("date-posted-sort").style.color = "#FFFFFF"
        //       } else {
        //         document.getElementById("date-posted-sort").style.background = "#FFFFFF"
        //         document.getElementById("date-posted-sort").style.color = "#3B485F"
        //       }
        //     }
            
        //     if (res.data()['donorDiet'] !== undefined) {
        //       this.dietaryRestrictions = res.data()['donorDiet'];
        //     }

        //     if (res.data()['isOnHealthSupplements'] !== undefined) {
        //       this.isOnHealthSupplements = res.data()['isOnHealthSupplements'];
        //       if (this.isOnHealthSupplements) {
        //         this.addHealthSupplementsFilterYes();
        //       } else {
        //         this.addHealthSupplementsFilterNo();
        //       }
        //     }

        //     if (res.data()['milkType'] !== undefined && res.data()['donorBabyAge'] !== undefined) {
        //       this.filterForm = new FormGroup({
        //         milkType: new FormControl(res.data()['milkType']),
        //       // healthSupplements: new FormControl("", Validators.required),
        //         donorBabyAge: new FormControl(res.data()['donorBabyAge'])
        //       })
        //     }
        //   }
        // })
      }
    });
  }

  addDatePostedSort() {
    this.isDatePostedSortSelected = !this.isDatePostedSortSelected;
    if (this.isDatePostedSortSelected) {
      document.getElementById("date-posted-sort").style.background = "#3B485F"
      document.getElementById("date-posted-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-posted-sort").style.background = "#FFFFFF"
      document.getElementById("date-posted-sort").style.color = "#3B485F"
    }
  }

  addDateExpressedSort() {
    this.isDateExpressedSortSelected = !this.isDateExpressedSortSelected;
    if (this.isDateExpressedSortSelected) {
      document.getElementById("date-expressed-sort").style.background = "#3B485F"
      document.getElementById("date-expressed-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-expressed-sort").style.background = "#FFFFFF"
      document.getElementById("date-expressed-sort").style.color = "#3B485F"
    }
  }

  addHealthSupplementsFilterYes() {
    this.isOnHealthSupplements = true;
    this.setColorOfHealthSupplements(this.isOnHealthSupplements)
  }

  setColorOfHealthSupplements(res:boolean) {
    document.getElementById("yes-button").style.background = res ? "#3B485F" : "#fff"
    document.getElementById("no-button").style.background = res ? "#fff" : "#3B485F"
    document.getElementById("yes-button").style.color = res ? "#FFFFFF" : "#9896AF"
    document.getElementById("no-button").style.color = res ? "#9896AF" : "#FFFFFF"
  }

  addHealthSupplementsFilterNo() {
    this.isOnHealthSupplements = false;
    this.setColorOfHealthSupplements(this.isOnHealthSupplements)
  }


  // get MilkType() { return this.filterForm.get('milkType').value }
  // get DonorBabyAge() { return this.filterForm.get('donorBabyAge').value }
  

  applyFilter() {
    // this.activeModal.close();
    // this.filterService.addFilterListings(this.currentUser.uid, this.isDateExpressedSortSelected, 
    //   this.isDatePostedSortSelected, this.MilkType, 
    //   this.dietaryRestrictions, this.isOnHealthSupplements, this.DonorBabyAge
    // )
    // .then(() => window.location.reload());
  }

  close() {
    // this.activeModal.close();
  }
}
