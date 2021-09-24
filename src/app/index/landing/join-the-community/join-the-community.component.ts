import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-the-community',
  templateUrl: './join-the-community.component.html',
  styleUrls: ['./join-the-community.component.css']
})
export class JoinTheCommunityComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['landing/articles']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
