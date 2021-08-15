import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ForgetPasswordComponent } from './index/forget-password/forget-password.component';
import { LandingComponent } from './index/landing/landing.component';
import { LoginComponent } from './index/login/login.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { BasicDetailsComponent } from './profile-setup/basic-details/basic-details.component';
import { HealthDeclarationComponent } from './profile-setup/health-declaration/health-declaration.component';
import { LifestyleInformationComponent } from './profile-setup/lifestyle-information/lifestyle-information.component';
import { DietaryRestrictionsComponent } from './profile-setup/dietary-restrictions/dietary-restrictions.component';
import { ChildProfileComponent } from './profile-setup/child-profile/child-profile.component';
import { CompletedProfileSetupComponent } from './profile-setup/completed-profile-setup/completed-profile-setup.component';
import { TypeSetupComponent } from './profile-setup/type-setup/type-setup.component';


const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'forget-password', component: ForgetPasswordComponent},
  {path: 'profile-setup/type-setup', component: TypeSetupComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/basic-details', component: BasicDetailsComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/health-declaration', component: HealthDeclarationComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/lifestyle-information', component: LifestyleInformationComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/dietary-restrictions', component: DietaryRestrictionsComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/child-profile', component: ChildProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/completed-profile-setup', component: CompletedProfileSetupComponent, canActivate: [AuthGuard]},
  {path: 'marketplace', component: MarketplaceComponent, canActivate: [AuthGuard]},
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {

      })
  ],
  exports: [RouterModule]
})


export class AppRoutingModule { }
