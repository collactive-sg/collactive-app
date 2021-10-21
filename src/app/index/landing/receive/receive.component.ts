import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {

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
    this.router.navigate(['landing/join-the-community']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
