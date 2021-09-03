import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { HomePageComponent } from './home-page/home-page.component';



@NgModule({
  declarations: [ProfileSettingsComponent, HomePageComponent],
  imports: [
    CommonModule
  ]
})
export class HomeModule { }
