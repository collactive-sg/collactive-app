import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './index/forget-password/forget-password.component';
import { LandingComponent } from './index/landing/landing.component';
import { LoginComponent } from './index/login/login.component';
import { MarketplaceComponent } from './marketplace/marketplace/marketplace.component';
import { BasicDetailsComponent } from './profile-setup/basic-details/basic-details.component';
import { HealthDeclarationComponent } from './profile-setup/health-declaration/health-declaration.component';
import { LifestyleInformationComponent } from './profile-setup/lifestyle-information/lifestyle-information.component';
import { DietaryRestrictionsComponent } from './profile-setup/dietary-restrictions/dietary-restrictions.component';
import { ChildProfileComponent } from './profile-setup/child-profile/child-profile.component';
import { CompletedProfileSetupComponent } from './profile-setup/completed-profile-setup/completed-profile-setup.component';
import { TypeSetupComponent } from './profile-setup/type-setup/type-setup.component';
import { ListingPageComponent } from './marketplace/listing-page/listing-page.component';
import { NewListingComponent } from './marketplace/new-listing/new-listing.component';
import { ProfileSettingsComponent } from './home/profile-settings/profile-settings.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { EditListingComponent } from './marketplace/edit-listing/edit-listing.component';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'forget-password', component: ForgetPasswordComponent},
  {path: 'profile-setup/type-setup', component: TypeSetupComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/basic-details', component: BasicDetailsComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/health-declaration', component: HealthDeclarationComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/lifestyle-information', component: LifestyleInformationComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/dietary-restrictions', component: DietaryRestrictionsComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/child-profile', component: ChildProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile-setup/completed-profile-setup', component: CompletedProfileSetupComponent, canActivate: [AuthGuard]},
  {path: 'listing/:id', component: ListingPageComponent, canActivate: [AuthGuard]},
  {path: 'listing/:id/edit', component: EditListingComponent, canActivate: [AuthGuard]},
  {path: 'new-listing', component: NewListingComponent, canActivate: [AuthGuard]},
  {path: 'home/profile-settings', component: ProfileSettingsComponent, canActivate: [AuthGuard]},
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
