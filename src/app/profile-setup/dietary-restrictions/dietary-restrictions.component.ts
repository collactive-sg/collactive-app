import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-dietary-restrictions',
  templateUrl: './dietary-restrictions.component.html',
  styleUrls: ['./dietary-restrictions.component.css']
})
export class DietaryRestrictionsComponent implements OnInit {

  preferences = [
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

  dietaryPreferenceForm: FormGroup;
  currentUser;
  dietaryRestrictions: any = [];
  
  constructor(
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,
    private formBuilder: FormBuilder,
  ) { 
    this.dietaryPreferenceForm = this.formBuilder.group({
      preferences: new FormArray([])
    });
    this.currentUser = this.auth.getUserAuthState();
  }

  ngOnInit(): void {
  }

  addDietaryPreference(preference, index, isChecked: boolean) {
    let newObj = preference;
    newObj.checked = isChecked;
    this.preferences[index] = newObj;
  }

  onNextButtonClick() {
    this.router.navigate(['profile-setup/child-profile']);
    this.dietaryRestrictions = <FormArray>this.dietaryPreferenceForm.controls.preferences;

    for (var preference of this.preferences) {
      if (preference.checked) {
        this.dietaryRestrictions.push(new FormControl(preference.name));
      }
    }
    this.userDataService.setDietaryRestrictions(this.currentUser.uid, {"dietary-restrictions": this.dietaryRestrictions.value});
  }

}
