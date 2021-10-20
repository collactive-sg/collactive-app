import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-type-setup',
  templateUrl: './type-setup.component.html',
  styleUrls: ['./type-setup.component.css']
})
export class TypeSetupComponent implements OnInit {
  
  isDonor:boolean;
  currentUser;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private auth: AuthService,
  ) {
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = ''
        }
      })
  }

  ngOnInit(): void {
  }

  updateDonorStatus() {
    this.router.navigate(['profile-setup/basic-details']);
    this.userDataService.updateUserDoc(this.currentUser.uid, {"isDonor": this.isDonor});

  }

  onClickDonor() {
    document.getElementById('donor').style.borderWidth = '4px';
    document.getElementById('receiver').style.borderWidth = '0px';
    this.isDonor = true;
    this.updateDonorStatus()
  }

  onClickReceiver() {
    document.getElementById('receiver').style.borderWidth = '4px';
    document.getElementById('donor').style.borderWidth = '0px';
    this.isDonor = false;
    this.updateDonorStatus()
  }
}
