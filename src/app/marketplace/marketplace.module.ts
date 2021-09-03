import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { SharedModule } from '../shared/shared.module';
import { ListingPageComponent } from './listing-page/listing-page.component';
import { NewListingComponent } from './new-listing/new-listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MarketplaceComponent, ListingPageComponent, NewListingComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MarketplaceModule { }
