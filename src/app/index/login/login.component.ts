import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeInfoModalComponent } from 'src/app/profile-setup/type-info-modal/type-info-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginErrorMessage = "";
  signUpForm: FormGroup;
  isSignUpTermsChecked = false;
  signUpErrorMessage = "";
  isDonor;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    private router: Router,
    private userDataService: UserDataService,
    private modalService: NgbModal
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required)
    });
    this.signUpForm = new FormGroup({
      email: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
    
   }

  ngOnInit(): void {
  }

  get LoginEmail() { return this.loginForm.get('email') }
  get LoginPassword() { return this.loginForm.get('password') }
  
  get SignUpEmail() { return this.signUpForm.get('email') }
  get SignUpPassword() { return this.signUpForm.get('password') }
  get SignUpConfirmPassword() { return this.signUpForm.get('confirmPassword') }


  onReset(): void {
    this.loginForm.setValue({email: '', password: '' });
    this.signUpForm.setValue({email: '', password: '' , confirmPassword: ''});
  }

  onLoginButtonClick() {
    if (!this.LoginEmail.invalid) {
      this.auth.login(this.LoginEmail.value, this.LoginPassword.value).then(res => {
        if (res.user) {
          this.loginErrorMessage = "";
          this.router.navigate(['/home']);
        }
      }).catch(err => {
        if (err.code == "auth/user-not-found") {
          this.loginErrorMessage = "There is no user with this email.";
        } else if (err.code == "auth/wrong-password") {
          this.loginErrorMessage = "You have entered an invalid email or password.";
        } else {
          this.loginErrorMessage = err.message;
        }
      });
    } else {
      this.alertWrongEmail();
    }
  }

  alertWrongEmail() {
    window.alert("Please enter a valid email.")
  }

  onSignUpButtonClick() { 
    var hasCheckedTerms = document.getElementById('invalidCheck2') as HTMLInputElement;
    if (!this.SignUpEmail.invalid && hasCheckedTerms.checked && 
      this.SignUpPassword.value == this.SignUpConfirmPassword.value) {
      this.auth.register(this.SignUpEmail.value, this.SignUpPassword.value).then(res => {
        this.signUpErrorMessage = "";
        this.auth.getUserAuthState().onAuthStateChanged((user) => {
          if (user) {
            this.updateDonorStatus(user);
          }
        })
        this.router.navigate(['/profile-setup/basic-details']);
      }).catch(err => {
        if (err.code == "auth/weak-password") {
          this.signUpErrorMessage = "Password should be at least 6 characters.";
        } else if (err.code == "auth/invalid-email") {
          this.signUpErrorMessage = "Please key in a valid email";
        } else if (err.code == "auth/email-already-in-use") {
          this.signUpErrorMessage = "This email is already in use.";
        } else {
          this.signUpErrorMessage = err.message;
        }
      })

    } else if (this.SignUpEmail.invalid) {
      this.alertWrongEmail();
    } else if (!hasCheckedTerms.checked) {
      document.getElementById('invalidCheck2').style.borderColor = "#dc3545"
    } else if (this.SignUpPassword.value != this.SignUpConfirmPassword.value) {
      this.signUpErrorMessage = "The passwords do not match."
    }
  }

  onCheckBoxClick() {
    var hasCheckedTerms = document.getElementById('invalidCheck2') as HTMLInputElement;
    if (hasCheckedTerms.checked) {
      document.getElementById('invalidCheck2').style.borderColor = "#F1ECE9"
    } else {
      document.getElementById('invalidCheck2').style.borderColor = "#dc3545"
    }
  }

  onChangeToLogIn() {
    document.getElementById('signUpForm').style.display = "none";
    document.getElementById('signUpOptions').style.display = "none";
    document.getElementById('signup-toggle-button').style.color = "#7C7474";
    document.getElementById('signup-toggle-button').style.background = "#C4C4C4";
    document.getElementById('loginForm').style.display = "block";
    document.getElementById('logInOptions').style.display = "flex";
    document.getElementById('login-toggle-button').style.color = "#FFFFFF";
    document.getElementById('login-toggle-button').style.background = "#E793A2";
    document.getElementById('header-text').innerHTML = "Hello, welcome back";
  }

  onChangeToSignUp() {
    document.getElementById('loginForm').style.display = "none";
    document.getElementById('logInOptions').style.display = "none";
    document.getElementById('login-toggle-button').style.color = "#7C7474";
    document.getElementById('login-toggle-button').style.background = "#C4C4C4";
    document.getElementById('signUpForm').style.display = "block";
    document.getElementById('signUpOptions').style.display = "flex";
    document.getElementById('signup-toggle-button').style.color = "#FFFFFF";
    document.getElementById('signup-toggle-button').style.background = "#E793A2";
    document.getElementById('header-text').innerHTML = "Create account";
  }


  // type set-up
  openInfoModal() {
    this.modalService.open(TypeInfoModalComponent, { centered: true });
  }

  updateDonorStatus(user) {
    this.router.navigate(['profile-setup/basic-details']);
    this.userDataService.updateUserDoc(user.uid, {"isDonor": this.isDonor});
  }

  onClickDonor() {
    document.getElementById('donor').style.borderWidth = '4px';
    document.getElementById('receiver').style.borderWidth = '0px';
    this.isDonor = true;
  }

  onClickReceiver() {
    document.getElementById('receiver').style.borderWidth = '4px';
    document.getElementById('donor').style.borderWidth = '0px';
    this.isDonor = false;
  }

}
