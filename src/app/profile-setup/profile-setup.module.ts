import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeSetupComponent } from './type-setup/type-setup.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [TypeSetupComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: []
})
export class ProfileSetupModule { }
