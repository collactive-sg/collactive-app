import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-child-profile',
  templateUrl: './child-profile.component.html',
  styleUrls: ['./child-profile.component.css']
})
export class ChildProfileComponent implements OnInit {

  childProfileForm: FormGroup;
  
  currentUser;
  minDate;
  allergens = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  allergens1 = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  allergens2 = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  allergens3 = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  allergens4 = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]

  childAllergens = this.allergens;
  childAllergens1 = this.allergens1;
  childAllergens2 = this.allergens2;
  childAllergens3 = this.allergens3;
  childAllergens4 = this.allergens4;

  childProfileAllergens;
  childProfileAllergens1;
  childProfileAllergens2;
  childProfileAllergens3;
  childProfileAllergens4;

  isChild1 = false;
  isChild2 = false;
  isChild3 = false;
  isChild4 = false;
  
  childrenProfiles = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,
    ) { 
      this.childProfileForm = this.formBuilder.group({
        dateOfBirth: new FormControl({year: 2020, month: 1, day: 1}, Validators.required),
        gender: new FormControl('F', Validators.required),
        allergies: new FormArray([]),
        
        dateOfBirth1: new FormControl({year: 2020, month: 1, day: 1}, Validators.required),
        gender1: new FormControl('F', Validators.required),
        allergies1: new FormArray([]),

        dateOfBirth2: new FormControl({year: 2020, month: 1, day: 1}, Validators.required),
        gender2: new FormControl('F', Validators.required),
        allergies2: new FormArray([]),

        dateOfBirth3: new FormControl({year: 2020, month: 1, day: 1}, Validators.required),
        gender3: new FormControl('F', Validators.required),
        allergies3: new FormArray([]),

        dateOfBirth4: new FormControl({year: 2020, month: 1, day: 1}, Validators.required),
        gender4: new FormControl('F', Validators.required),
        allergies4: new FormArray([]),
      });

      this.auth.getUserAuthState().authState.subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      })
  }

  ngOnInit(): void {
  }

  onChangeChild1(event) {
    this.isChild1 = !this.isChild1;
  }
  onChangeChild2(event) {
    this.isChild2 = !this.isChild2;
  }
  onChangeChild3(event) {
    this.isChild3 = !this.isChild3;
  }
  onChangeChild4(event) {
    this.isChild4 = !this.isChild4;
  }

  addAllergen(allergen, index, isChecked: boolean) {
    let newObj = allergen;
    newObj.checked = isChecked;
    this.childAllergens[index] = newObj;
  }

  addAllergen1(allergen, index, isChecked: boolean) {
    let newObj = allergen;
    newObj.checked = isChecked;
    this.childAllergens1[index] = newObj;
  }

  addAllergen2(allergen, index, isChecked: boolean) {
    let newObj = allergen;
    newObj.checked = isChecked;
    this.childAllergens2[index] = newObj;
  }

  addAllergen3(allergen, index, isChecked: boolean) {
    let newObj = allergen;
    newObj.checked = isChecked;
    this.childAllergens3[index] = newObj;
  }

  addAllergen4(allergen, index, isChecked: boolean) {
    let newObj = allergen;
    newObj.checked = isChecked;
    this.childAllergens4[index] = newObj;
  }

  updateAllergies() {
    this.childProfileAllergens = <FormArray>this.childProfileForm.controls.allergies;
    for (var allergen of this.childAllergens) {
      if (allergen.checked) {
        this.childProfileAllergens.push(new FormControl(allergen.name));
      }
    }
  }

  updateAllergies1() {
    this.childProfileAllergens1 = <FormArray>this.childProfileForm.controls.allergies1;
    for (var allergen of this.childAllergens1) {
      if (allergen.checked) {
        this.childProfileAllergens1.push(new FormControl(allergen.name));
      }
    }
  }

  updateAllergies2() {
    this.childProfileAllergens2 = <FormArray>this.childProfileForm.controls.allergies2;
    for (var allergen of this.childAllergens2) {
      if (allergen.checked) {
        this.childProfileAllergens2.push(new FormControl(allergen.name));
      }
    }
  }

  updateAllergies3() {
    this.childProfileAllergens3 = <FormArray>this.childProfileForm.controls.allergies3;
    for (var allergen of this.childAllergens3) {
      if (allergen.checked) {
        this.childProfileAllergens3.push(new FormControl(allergen.name));
      }
    }
  }

  updateAllergies4() {
    this.childProfileAllergens4 = <FormArray>this.childProfileForm.controls.allergies4;
    for (var allergen of this.childAllergens4) {
      if (allergen.checked) {
        this.childProfileAllergens4.push(new FormControl(allergen.name));
      }
    }
  }

  onNextButtonClick() {
    this.router.navigate(['profile-setup/completed-profile-setup']);
    
    this.updateAllergies();
    this.childrenProfiles.push(
      {"child-profile": {
        "date-of-birth": this.childProfileForm.controls.dateOfBirth.value, 
        "gender": this.childProfileForm.controls.gender.value,
        "allergies": this.childProfileAllergens.value
      }})

    if (this.isChild1) {
      this.updateAllergies1();
      this.childrenProfiles.push(
        {"child-profile": {
          "date-of-birth": this.childProfileForm.controls.dateOfBirth1.value, 
          "gender": this.childProfileForm.controls.gender1.value,
          "allergies": this.childProfileAllergens1.value
        }})
    }
    
    if (this.isChild2) {
      this.updateAllergies2();
      this.childrenProfiles.push(
      {"child-profile": {
        "date-of-birth": this.childProfileForm.controls.dateOfBirth2.value, 
        "gender": this.childProfileForm.controls.gender2.value,
        "allergies": this.childProfileAllergens2.value
      }})
    }

    if (this.isChild3) {
      this.updateAllergies3();
      this.childrenProfiles.push(
      {"child-profile": {
        "date-of-birth": this.childProfileForm.controls.dateOfBirth3.value, 
        "gender": this.childProfileForm.controls.gender3.value,
        "allergies": this.childProfileAllergens3.value
      }})
    }

    if (this.isChild4) {
      this.updateAllergies4();
      this.childrenProfiles.push(
      {"child-profile": {
        "date-of-birth": this.childProfileForm.controls.dateOfBirth4.value, 
        "gender": this.childProfileForm.controls.gender4.value,
        "allergies": this.childProfileAllergens4.value
      }})
    }

    this.userDataService.setChildProfile(this.currentUser.uid, {"children": this.childrenProfiles});
  }

}
