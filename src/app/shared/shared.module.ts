import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { ListingComponent } from './listing/listing.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    TopbarComponent,
    ListingComponent,
    BottomNavComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TopbarComponent,
    BottomNavComponent,
    ListingComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
