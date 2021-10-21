import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-join-the-community',
  templateUrl: './join-the-community.component.html',
  styleUrls: ['./join-the-community.component.css']
})
export class JoinTheCommunityComponent implements OnInit {

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
    this.router.navigate(['landing/articles']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
