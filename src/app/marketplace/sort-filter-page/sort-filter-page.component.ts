import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sort-filter-page',
  templateUrl: './sort-filter-page.component.html',
  styleUrls: ['./sort-filter-page.component.css']
})
export class SortFilterPageComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
  }

}
