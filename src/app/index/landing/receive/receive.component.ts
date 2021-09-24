import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['landing/join-the-community']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
