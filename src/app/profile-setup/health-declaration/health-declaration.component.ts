import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { TYPE_SETTINGS } from '../constants';


@Component({
  selector: 'app-health-declaration',
  templateUrl: './health-declaration.component.html',
  styleUrls: ['./health-declaration.component.css'],
})
export class HealthDeclarationComponent implements OnInit {

  didNotCheckAllBoxesMessage = "";
  currentUser;
  readonly TYPE_SETTINGS = TYPE_SETTINGS;
  type;
  constructor(
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,
    private _location: Location
  ) { 
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = ''
        }
      })
    this.type = window.history.state.type
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    var checkBoxes = document.getElementsByClassName("form-check-input");
    var areAllCheckBoxesChecked = true;
    for (let i = 0; i < checkBoxes.length; i++) {
      const element = checkBoxes[i] as HTMLInputElement;
      if (!element.checked) {
        areAllCheckBoxesChecked = false;
        break;
      }
    }
    if (!areAllCheckBoxesChecked && this.type != TYPE_SETTINGS) {
      // TODO How to phrase this message?
      if (window.confirm("You did not check all boxes, would you like to proceed with the set up of a normal user?")) {
        this.userDataService.updateUserDoc(this.currentUser.uid, {"isDonor": false});
        this.router.navigate(['profile-setup/child-profile']);
      } else {
        this.didNotCheckAllBoxesMessage = "You did not check all boxes"
      }
    } else if (!areAllCheckBoxesChecked && this.type == TYPE_SETTINGS) {
      if (window.confirm("You did not check all boxes, This might cause you to lose the status of Donor")) {
        this.userDataService.updateUserDoc(this.currentUser.uid, {"isDonor": false});
        this._location.back();
      } else {
        this.didNotCheckAllBoxesMessage = "You did not check all boxes"
      }
    } else {
      this.userDataService.updateUserDoc(this.currentUser.uid, {"isHealthDeclarationsChecked": true});
      if (this.type == TYPE_SETTINGS) this._location.back();
      else this.router.navigate(['profile-setup/lifestyle-information']);
    }
  }

}
