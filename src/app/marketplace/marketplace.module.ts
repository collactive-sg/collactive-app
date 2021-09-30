import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { SharedModule } from '../shared/shared.module';
import { ListingPageComponent } from './listing-page/listing-page.component';
import { NewListingComponent } from './new-listing/new-listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditListingComponent } from './edit-listing/edit-listing.component';
import { SortFilterPageComponent } from './sort-filter-page/sort-filter-page.component';


@NgModule({
  declarations: [MarketplaceComponent, ListingPageComponent, NewListingComponent, EditListingComponent, SortFilterPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MarketplaceModule { }
