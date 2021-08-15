import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { ListingComponent } from './listing/listing.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';


@NgModule({
  declarations: [
    TopbarComponent,
    ListingComponent,
    BottomNavComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TopbarComponent,
    BottomNavComponent,
  ]
})
export class SharedModule { }
