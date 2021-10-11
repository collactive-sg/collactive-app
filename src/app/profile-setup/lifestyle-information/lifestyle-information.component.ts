import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-lifestyle-information',
  templateUrl: './lifestyle-information.component.html',
  styleUrls: ['./lifestyle-information.component.css']
})
export class LifestyleInformationComponent implements OnInit {

  lifestyleInfoForm : FormGroup;
  currentUser;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private userDataService: UserDataService,
    ) {
      this.lifestyleInfoForm = this.formBuilder.group({
        isSmoker: new FormControl(true, Validators.required),
        isDrinker: new FormControl(true, Validators.required),
        isCaffeineConsumer: new FormControl(true, Validators.required),
      });

      this.auth.getUserAuthState().authState.subscribe((user) => {
        if (user) {
          this.currentUser = user;
          
          this.userDataService.getUserDoc(this.currentUser.uid).subscribe(userDoc => {
            if (userDoc['lifestyle-info'] !== undefined) {
              this.lifestyleInfoForm = this.formBuilder.group({
                isSmoker: new FormControl(userDoc['lifestyle-info']['isSmoker'], Validators.required),
                isDrinker: new FormControl(userDoc['lifestyle-info']['isDrinker'], Validators.required),
                isCaffeineConsumer: new FormControl(userDoc['lifestyle-info']['isCaffeineConsumer'], Validators.required),
              });
            }
          });
        }
      });
    }

  ngOnInit(): void {
  }


  get IsSmoker() { return this.lifestyleInfoForm.get('isSmoker') }
  get IsDrinker() { return this.lifestyleInfoForm.get('isDrinker') }
  get IsCaffeineConsumer() { return this.lifestyleInfoForm.get('isCaffeineConsumer') }

  changeSmokerFormValue(bool:boolean) {
    this.lifestyleInfoForm.patchValue({
      IsSmoker: bool
    })
    this.setColorOfToggleButton(bool, 'smoker');
  }

  changeAlcoholFormValue(bool:boolean) {
    this.lifestyleInfoForm.patchValue({
      isDrinker: bool
    })
    this.setColorOfToggleButton(bool, 'alcohol');
  }

  changeCaffeineFormValue(bool:boolean) {
    this.lifestyleInfoForm.patchValue({
      isCaffeineConsumer: bool
    })
    this.setColorOfToggleButton(bool, 'caffeine');
  }

  setColorOfToggleButton(res:boolean, type:string) {
    document.getElementById(`${type}-toggle-no`).style.background = res ? "#546684" : "#fff"
    document.getElementById(`${type}-toggle-yes`).style.background = res ? "#fff" : "#546684"
    document.getElementById(`${type}-toggle-no`).style.color = res ? "#FFFFFF" : "#9896AF"
    document.getElementById(`${type}-toggle-yes`).style.color = res ? "#9896AF" : "#FFFFFF"
  }

  onNextButtonClick() {
    this.router.navigate(['profile-setup/dietary-restrictions']);
    this.userDataService.updateUserDoc(this.currentUser.uid, {"lifestyle-info": this.lifestyleInfoForm.value});
  }

}
