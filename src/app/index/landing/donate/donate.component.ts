import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
  ) { 
    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) { this.router.navigate(['/home']);}
    })
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['landing/receive']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
