import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort-filter-page',
  templateUrl: './sort-filter-page.component.html',
  styleUrls: ['./sort-filter-page.component.css']
})
export class SortFilterPageComponent implements OnInit {

  isDatePostedSortSelected = false;
  isDateExpressedSortSelected = false;

  constructor(
    public activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
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
