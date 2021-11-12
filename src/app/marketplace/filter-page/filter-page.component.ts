import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-page',
  templateUrl: './filter-page.component.html',
  styleUrls: ['./filter-page.component.css']
})
export class FilterPageComponent implements OnInit {

  currentUser;
  @Input() isDatePostedSortSelected;
  @Input() isDateExpressedSortSelected;
  @Input() isHealthSupplementsFilterChosen;
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
    ) { }

  ngOnInit(): void {

    this.setStyleOfHealthSupplements(this.isOnHealthSupplements);
    this.setStyleOfDateExpressedSort(this.isDateExpressedSortSelected);
    this.setStyleOfDatePostedSort(this.isDatePostedSortSelected);
  }

  addDatePostedSort() {
    this.isDatePostedSortSelected = !this.isDatePostedSortSelected;
    this.setStyleOfDatePostedSort(this.isDatePostedSortSelected);
  }

  addDateExpressedSort() {
    this.isDateExpressedSortSelected = !this.isDateExpressedSortSelected;
    this.setStyleOfDateExpressedSort(this.isDateExpressedSortSelected);
  }

  setStyleOfDateExpressedSort(res:boolean) {
    document.getElementById("date-expressed-sort").style.background = res? "#3B485F" : "#FFFFFF";
    document.getElementById("date-expressed-sort").style.color = res? "#FFFFFF" : "#3B485F"
  }

  setStyleOfDatePostedSort(res:boolean) {
    document.getElementById("date-posted-sort").style.background = res? "#3B485F" : "#FFFFFF";
    document.getElementById("date-posted-sort").style.color = res? "#FFFFFF" : "#3B485F"
  }
  
  addHealthSupplementsFilterYes() {
    if (this.isHealthSupplementsFilterChosen) {
      this.isOnHealthSupplements = true;
      this.setStyleOfHealthSupplements(this.isOnHealthSupplements)
    }
  }

  setStyleOfHealthSupplements(res:boolean) {
    document.getElementById("yes-button").style.background = res ? "#3B485F" : "#fff"
    document.getElementById("no-button").style.background = res ? "#fff" : "#3B485F"
    document.getElementById("yes-button").style.color = res ? "#FFFFFF" : "#9896AF"
    document.getElementById("no-button").style.color = res ? "#9896AF" : "#FFFFFF"
  }

  addHealthSupplementsFilterNo() {
    if (this.isHealthSupplementsFilterChosen) {
      this.isOnHealthSupplements = false;
      this.setStyleOfHealthSupplements(this.isOnHealthSupplements)
    }
  }

}
