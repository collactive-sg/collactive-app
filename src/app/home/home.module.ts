import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationBoxComponent } from './notification-box/notification-box.component';



@NgModule({
  declarations: [ProfileSettingsComponent, HomePageComponent, NotificationBoxComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ProfileSettingsComponent,
    HomePageComponent
  ]
})
export class HomeModule { }
