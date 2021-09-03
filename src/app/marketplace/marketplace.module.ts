import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceComponent } from './marketplace/marketplace.component';
// import { ListingComponent } from '../shared/listing/listing.component';
import { SharedModule } from '../shared/shared.module';
import { ListingPageComponent } from './listing-page/listing-page.component';
import { NewListingComponent } from './new-listing/new-listing.component';


@NgModule({
  declarations: [MarketplaceComponent, ListingPageComponent, NewListingComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class MarketplaceModule { }
