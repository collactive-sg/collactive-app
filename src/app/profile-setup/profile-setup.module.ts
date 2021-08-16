import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeSetupComponent } from './type-setup/type-setup.component';
import { SharedModule } from '../shared/shared.module';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HealthDeclarationComponent } from './health-declaration/health-declaration.component';
import { LifestyleInformationComponent } from './lifestyle-information/lifestyle-information.component';
import { DietaryRestrictionsComponent } from './dietary-restrictions/dietary-restrictions.component';
import { ChildProfileComponent } from './child-profile/child-profile.component';
import { CompletedProfileSetupComponent } from './completed-profile-setup/completed-profile-setup.component';


@NgModule({
  declarations: [TypeSetupComponent, BasicDetailsComponent, HealthDeclarationComponent, LifestyleInformationComponent, DietaryRestrictionsComponent, ChildProfileComponent, CompletedProfileSetupComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: []
})
export class ProfileSetupModule { }
