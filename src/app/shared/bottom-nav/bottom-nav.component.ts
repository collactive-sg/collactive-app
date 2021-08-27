import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {

  @Input() isDonor;
  constructor() { }

  ngOnInit(): void {
  }

}
