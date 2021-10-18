import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-breast-milk-sharing',
  templateUrl: './breast-milk-sharing.component.html',
  styleUrls: ['./breast-milk-sharing.component.css']
})
export class BreastMilkSharingComponent implements OnInit {

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
    this.router.navigate(['landing/donate']);
  }

  onSkipButtonClick() {
    this.router.navigate(['landing/articles'])
  }

}
