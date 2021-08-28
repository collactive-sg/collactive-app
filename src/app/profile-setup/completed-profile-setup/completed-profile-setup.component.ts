import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-completed-profile-setup',
  templateUrl: './completed-profile-setup.component.html',
  styleUrls: ['./completed-profile-setup.component.css']
})
export class CompletedProfileSetupComponent implements OnInit {

  currentUser;
  isDonor = false;
  doc;

  constructor(
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService
  ) { 
    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.doc = this.userDataService.getUserDetails(this.currentUser.uid).then(
          response => {
            this.doc = response.data();
            this.isDonor = this.doc['isDonor'];
          }
        );
      };
    });
    
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['marketplace']);
  }

}
