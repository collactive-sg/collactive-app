import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-sort-page',
  templateUrl: './sort-page.component.html',
  styleUrls: ['./sort-page.component.css']
})
export class SortPageComponent implements OnInit {

  @Input() sortChoice;
  constructor() { }

  ngOnInit(): void {
  }

  clearSort() {
    this.sortChoice = 0;
  }
}
