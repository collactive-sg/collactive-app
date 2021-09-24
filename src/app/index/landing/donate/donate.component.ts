import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['landing/receive']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
