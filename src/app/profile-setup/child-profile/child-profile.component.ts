import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-child-profile',
  templateUrl: './child-profile.component.html',
  styleUrls: ['./child-profile.component.css']
})
export class ChildProfileComponent implements OnInit {

  currentUser;
  isDonor;

  childProfileForm: FormGroup;
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  allergens = [
    {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
    {name:"Eggs", checked: false},
    {name:"Cow’s milk", checked: false},
    {name:"Peanuts and other tree nuts", checked: false},
    {name:"Grains such as wheat, oat, and barley", checked: false},
    {name:"Soy", checked: false},
    {name:"Fish", checked: false},
  ]
  childrenProfiles = [];
  currentChildID: String;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,
    ) { 
      this.childProfileForm = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        dateOfBirth: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required)
      });

      this.auth.getUserAuthState().authState.subscribe((user) => {
        if (user) {
          this.currentUser = user;
          this.userDataService.getUserDetails(this.currentUser.uid).then(
            response => {
              let doc = response.data();
              this.isDonor = doc['isDonor'];
              this.userDataService.getChildren(this.currentUser.uid).then(collection => {
                collection.docs.forEach(docu => this.childrenProfiles.push(docu.data()))
              });
            }
          );
        };
      });
  }

  ngOnInit(): void {
  }
  get name() { return this.childProfileForm.get('name'); }
  get dateOfBirth() { return this.childProfileForm.get('dateOfBirth'); }
  get gender() { return this.childProfileForm.get('gender'); }

  onNextButtonClick() {
    if (!this.saveChild() && this.childrenProfiles.length < 1) {
      if (!window.confirm("The details you entered either wrong or incomplete. We encourage you to input your child's details to find appropriate matches for you. Please input your child's details if possible.")) {
        this.router.navigate(['profile-setup/completed-profile-setup']);
      }
    } else if (!this.saveChild() && this.childrenProfiles.length >= 1 ) {
      if (!window.confirm("The details you entered are either wrong or incomplete. If you move on, the profile for this new child will not be saved (previously saved child profiles are unaffected).")) {
        this.router.navigate(['profile-setup/completed-profile-setup']);
      }
    } else {
      this.router.navigate(['profile-setup/completed-profile-setup']);
    }
  }

  convertAllergiesToString() {
    let str = "";
    this.allergens.forEach(element => {
      if (element.checked) {
        str = str.concat(element.name);
        str = str.concat("_ ")
      }
    });

    if (str.length == 0) {
      str = "e.g. Nuts";
    } else {
      str = str.replace(/_([^_]*)$/, '$1')
      str = str.replace(/_/g, ', ')
    }

    return str;
  }

  convertAllergiesListToString(lst) {
    let str = "";
    lst.forEach(element => {
      if (element.checked) {
        str = str.concat(element.name);
        str = str.concat("_ ")
      }
    });

    if (str.length == 0) {
      str = "None";
    } else {
      str = str.replace(/_([^_]*)$/, '$1')
      str = str.replace(/_/g, ', ')
    }

    return str;
  }

  addChild() {
    // reset form and childID
    this.currentChildID = undefined;
    this.childProfileForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required)
    });
    this.allergens = [
      {name: "Shellfish (lobster, prawn, shrimp, crab etc.)", checked: false},
      {name:"Eggs", checked: false},
      {name:"Cow’s milk", checked: false},
      {name:"Peanuts and other tree nuts", checked: false},
      {name:"Grains such as wheat, oat, and barley", checked: false},
      {name:"Soy", checked: false},
      {name:"Fish", checked: false},
    ]
  }

  correctFields() {
    document.getElementById("name").style.borderColor = "#ced4da";
    document.getElementById("childDateOfBirth").style.borderColor = "#ced4da";
    document.getElementById("gender").style.borderColor = "#ced4da";
    if (this.name.invalid) {
      document.getElementById("name").style.borderColor = "red";
      return false;
    } else if (this.dateOfBirth.invalid) {
      document.getElementById("childDateOfBirth").style.borderColor = "red";
      return false;
    } else if (this.gender.invalid) {
      document.getElementById("gender").style.borderColor = "red";
      return false;
    } else {
      return true;
    }
  }

  saveChild() {
    if (!this.correctFields()) {
      return false;
    }

    let childProfile = {
      "name": this.childProfileForm.controls.name.value,
      "dateOfBirth": this.childProfileForm.controls.dateOfBirth.value, 
      "gender": this.childProfileForm.controls.gender.value,
      "allergies": this.allergens
    }
    
    if (this.currentChildID === undefined) {
      this.userDataService.addNewChildProfile(this.currentUser.uid, childProfile);
    } else {
      childProfile["childID"] = this.currentChildID;
      this.userDataService.updateChildProfile(this.currentUser.uid, this.currentChildID, childProfile);
    }
    this.updateExistingChildren();
    this.addChild();
    return true;
  }

  selectChildProfile(childID: String) {
    if (childID === undefined) {
      window.location.reload();
    }
    this.userDataService.getChildProfile(this.currentUser.uid, childID).subscribe(
      doc => {
        let currentChild = doc.data();
        this.childProfileForm.controls.name.setValue(currentChild["name"]);
        this.childProfileForm.controls.dateOfBirth.setValue(currentChild["dateOfBirth"]);
        this.childProfileForm.controls.gender.setValue(currentChild["gender"]);
        this.allergens = currentChild["allergies"];
        this.currentChildID = childID;
      } 
    );
  }

  updateExistingChildren() {
    this.childrenProfiles = [];
    this.userDataService.getChildren(this.currentUser.uid).then(collection => {
      collection.docs.forEach(doc => this.childrenProfiles.push(doc.data()))
    });
  }

  deleteChildProfile(childID: String) {
    this.userDataService.deleteChildProfile(this.currentUser.uid, childID);
    this.updateExistingChildren();
  }

}
