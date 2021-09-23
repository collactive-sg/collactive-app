import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore"; 
import { merge } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  
  editlisting(listingData:any, listingID:string ) {
    return this.afs.collection('listings').doc(`${listingID}`).set(listingData, {merge:true} )
  }

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

  addLikeListing(userID: string, listingID: string) {
    return this.afs.collection(`likes_listings`).add({
      listingID: listingID,
      userID:userID,
      dateLiked: Date.now()
    }).then(res => {
      this.afs.collection('likes_listings').doc(res.id).set({likeListingID:res.id} , {merge:true});
    })
  }

  deleteLikeListing(userID, listingID) {
    return this.afs.collection(`likes_listings`).ref.where("userID", "==", userID).where("listingID", "==", listingID).get().then(res => {
      res.forEach( res => {
        this.afs.collection(`likes_listings`).doc(`${res.id}`).delete();
      })
    })
  }

  getLikedListingIDsByUserID(userID: string) {
    return this.afs.collection('likes_listings').ref.where("userID", "==", userID).get().then(col => {
      return col.docs.map((each:any) => each.data()['listingID'])
    });
  }

}
