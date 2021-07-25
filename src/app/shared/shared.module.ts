import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { ListingComponent } from './listing/listing.component';


@NgModule({
  declarations: [
    TopbarComponent,
    ListingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TopbarComponent
  ]
})
export class SharedModule { }
