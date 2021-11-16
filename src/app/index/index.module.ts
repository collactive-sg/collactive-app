import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { LandingComponent } from "./landing/landing.component";
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonateComponent } from './landing/donate/donate.component';
import { ReceiveComponent } from './landing/receive/receive.component';
import { JoinTheCommunityComponent } from './landing/join-the-community/join-the-community.component';
import { BreastMilkSharingComponent } from './landing/breast-milk-sharing/breast-milk-sharing.component';
import { ArticlesComponent } from './landing/articles/articles.component';
import { ProfileSetupModule } from "../profile-setup/profile-setup.module";

@NgModule({
  declarations: [LoginComponent, LandingComponent, ForgetPasswordComponent, DonateComponent, ReceiveComponent, JoinTheCommunityComponent, BreastMilkSharingComponent, ArticlesComponent],
  imports: [CommonModule, 
    SharedModule, 
    ReactiveFormsModule,
    FormsModule,
    ProfileSetupModule],
  exports: [
    LoginComponent,
    LandingComponent,
    ForgetPasswordComponent,
    DonateComponent, 
    ReceiveComponent, 
    JoinTheCommunityComponent, 
    BreastMilkSharingComponent, 
  ]
})
export class IndexModule {}
