import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breast-milk-sharing',
  templateUrl: './breast-milk-sharing.component.html',
  styleUrls: ['./breast-milk-sharing.component.css']
})
export class BreastMilkSharingComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['landing/donate']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
