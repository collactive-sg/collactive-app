import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore"; 
import { merge } from 'rxjs';

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

  addNewListing(data) {
    return this.afs.collection('listings').add(data).then(res => {
      this.afs.collection('listings').doc(res.id).set({listingID:res.id} , {merge:true});
      return res.id
    })
  }
}
