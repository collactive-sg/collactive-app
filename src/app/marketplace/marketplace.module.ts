import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceComponent } from './marketplace/marketplace.component';
// import { ListingComponent } from '../shared/listing/listing.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MarketplaceComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class MarketplaceModule { }
