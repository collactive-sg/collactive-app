import { ThrowStmt } from '@angular/compiler';
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

  addLikeListing(userID: string, listingID: string) {
    return this.afs.collection(`likes_listings`).add({
      listingID: listingID,
      userID:userID,
      dateLiked: Date.now()
    }).then(res => {
      this.afs.collection('likes_listings').doc(res.id).set({likeListingID:res.id} , {merge:true});
    }).then(() => {
      this.getListingByID(listingID).subscribe(res => {
        this.afs.collection(`notifications`).add({
          listingID: listingID,
          sender_userID: userID,
          receiver_userID: res["donorID"],
          createdAt: Date.now(),
          read: false,
          type: "like"
        }).then(res => {
          this.afs.collection('notifications').doc(res.id).set({notificationID:res.id} , {merge:true});
        })
      })
    })
  }

  deleteLikeListing(userID, listingID) {
    return this.afs.collection(`likes_listings`).ref.where("userID", "==", userID).where("listingID", "==", listingID).get()
    .then(res => {
      res.forEach( res => {
        this.afs.collection(`likes_listings`).doc(`${res.id}`).delete();
      })
    }).then(() => {
      return this.afs.collection(`notifications`).ref.where("sender_userID", "==", userID).where("listingID", "==", listingID).get()
    }).then(res => { 
      res.forEach( res => { 
        this.afs.collection(`notifications`).doc(`${res.id}`).delete(); 
      })
    })
  }

  getLikedListingIDsByUserID(userID: string) {
    return this.afs.collection('likes_listings').ref.where("userID", "==", userID).get().then(col => {
      return col.docs.map((each:any) => each.data()['listingID'])
    });
  }

  deleteListing(listingID:string) {
    return this.afs.collection('listings').doc(`${listingID}`).delete().then(() => {
      return this.afs.collection('notifications').ref.where("listingID", "==", listingID).get()
    }).then(res => {
      res.forEach( res => {
        this.afs.collection(`notifications`).doc(`${res.id}`).delete(); 
      })
    });
  }
  
  editlisting(listingData:any, listingID:string ) {
    return this.afs.collection('listings').doc(`${listingID}`).set(listingData, {merge:true} )
  }

}
