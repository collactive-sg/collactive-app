import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore"; 
import { NotificationsService } from '../notif/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(
    private afs: AngularFirestore,
    private notificationsService: NotificationsService
  ) { }

  getAllLiveListings() {
    return this.afs.collection('listings', ref => {return ref.where('status', '==', 'live')}).valueChanges();
  }

  getAllListingsByUser(userID: string) {
    return this.afs.collection('listings', ref => {return ref.where('donorID', '==', userID)}).valueChanges();
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
        return this.getListingByID(listingID).subscribe(res => { 
          this.notificationsService.createLikeNotification(listingID, userID, res);
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
      return this.notificationsService.deleteLikeNotification(listingID, userID);
    })
  }

  getLikedListingIDsByUserID(userID: string) {
    return this.afs.collection('likes_listings').ref.where("userID", "==", userID).get().then(col => {
      return col.docs.map((each:any) => each.data()['listingID'])
    });
  }

  removeListingTemporarily(listingID:string) {
    return this.afs.collection('listings').doc(`${listingID}`).set({status: 'archived'}, {merge: true});
  }

  deleteListing(listingID:string) {
    return this.afs.collection('listings').doc(`${listingID}`).delete().then(() => {
      return this.afs.collection('notifications').ref.where("listingID", "==", listingID).get()
    }).then(res => {
      res.forEach( res => {
        this.afs.collection(`notifications`).doc(`${res.id}`).delete(); 
      })
    }).then(() => {
      return this.afs.collection('chatrooms').ref.where('listingID', '==', listingID).get()
    }).then(res => {
      res.forEach( res => {
        this.afs.collection(`chatrooms`).doc(`${res.id}`).delete(); 
      })
    }).then(() => {
      return this.afs.collection('like_listings').ref.where('listingID', '==', listingID).get()
    }).then(res => {
      res.forEach( res => {
        this.afs.collection(`like_listings`).doc(`${res.id}`).delete(); 
      })
    }).then(() => {
      return this.afs.collection('messages').ref.where('listingID', '==', listingID).get()
    }).then(res => {
      res.forEach( res => {
        this.afs.collection(`messages`).doc(`${res.id}`).delete(); 
      })
    });
  }
  
  editlisting(listingData:any, listingID:string ) {
    return this.afs.collection('listings').doc(`${listingID}`).set(listingData, {merge:true} )
  }

}
