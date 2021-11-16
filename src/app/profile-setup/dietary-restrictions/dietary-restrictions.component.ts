import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { TYPE_SETTINGS } from '../constants';
import { Location } from '@angular/common';
@Component({
  selector: 'app-dietary-restrictions',
  templateUrl: './dietary-restrictions.component.html',
  styleUrls: ['./dietary-restrictions.component.css']
})
export class DietaryRestrictionsComponent implements OnInit {

  dietaryRestrictions = [
    { name: "Halal", checked: false },
    { name: "Vegan", checked: false },
    { name: "Vegetarian", checked: false },
    { name: "Kosher", checked: false },
    { name: "Pescatarian", checked: false },
    { name: "Dairy-free", checked: false },
    { name: "Gluten-free", checked: false },
    { name: "Nut-free", checked: false },
    { name: "Health supplements", checked: false }
  ]

  readonly TYPE_SETTINGS = TYPE_SETTINGS;
  type;
  currentUser;
  
  constructor(
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,
    private _location: Location
  ) { 
    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.userDataService.getUserDoc(this.currentUser.uid).subscribe(userDoc => {
          if (userDoc["dietary-restrictions"] != undefined) {
            this.dietaryRestrictions = userDoc["dietary-restrictions"];
          }
        });
      }
    });
    this.type = window.history.state.type
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.userDataService.updateUserDoc(this.currentUser.uid, {"dietary-restrictions": this.dietaryRestrictions});
    if (this.type == TYPE_SETTINGS) return this._location.back();
    else this.router.navigate(['profile-setup/child-profile']);
  }

}
