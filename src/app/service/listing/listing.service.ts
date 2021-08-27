import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore"; 

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getAllLiveListings() {
    return this.afs.collection('listings', ref => {return ref.where('status', '==', 'live')}).valueChanges();
  }

  getListingByID(listingID) {
    return this.afs.collection('listings').doc(`${listingID}`).valueChanges();
  }
}
