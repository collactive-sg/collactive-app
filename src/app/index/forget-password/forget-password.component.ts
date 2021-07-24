import { Component, OnInit } from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/service/auth/auth.service";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.css"],
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public auth: AuthService) {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl("", Validators.email),
    });
  }

  ngOnInit(): void {}

  get Email() {
    return this.forgetPasswordForm.get("email");
  }

  onResetButtonClick() {
    this.auth.sendPasswordResetEmail(this.Email.value).then(() => {
      document.getElementById("reset-form").style.display = "none";
      document.getElementById("reset-message").style.display = "flex";
    }).catch(e => {
      if(this.Email.value == "") {
        window.alert("Please key in a valid email.");
      } else {
        // Todo need to create proper err msg
      }
    })
  }
}
