import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort-filter-page',
  templateUrl: './sort-filter-page.component.html',
  styleUrls: ['./sort-filter-page.component.css']
})
export class SortFilterPageComponent implements OnInit {

  isDatePostedSortSelected = false;
  isDateExpressedSortSelected = false;
  filterForm: FormGroup;

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

  constructor(
    public activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      milkType: new FormControl('', Validators.required),
      // healthSupplements: new FormControl("", Validators.required),
      donorBabyAge: new FormControl("", Validators.required)
    });
  }

  addDatePostedFilter() {
    this.isDatePostedSortSelected = !this.isDatePostedSortSelected;
    if (this.isDatePostedSortSelected) {
      document.getElementById("date-posted-sort").style.background = "#3B485F"
      document.getElementById("date-posted-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-posted-sort").style.background = "#FFFFFF"
      document.getElementById("date-posted-sort").style.color = "#3B485F"
    }
  }

  addDateExpressedFilter() {
    this.isDateExpressedSortSelected = !this.isDateExpressedSortSelected;
    if (this.isDateExpressedSortSelected) {
      document.getElementById("date-expressed-sort").style.background = "#3B485F"
      document.getElementById("date-expressed-sort").style.color = "#FFFFFF"
    } else {
      document.getElementById("date-expressed-sort").style.background = "#FFFFFF"
      document.getElementById("date-expressed-sort").style.color = "#3B485F"
    }
  }

  applyFilter() {
    this.activeModal.close();
  }


  close() {
    this.activeModal.close();
  }
}
