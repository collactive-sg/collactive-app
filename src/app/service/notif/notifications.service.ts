import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private afs: AngularFirestore,
    private userDataService: UserDataService
  ) { }

  getNotificationsByUserID(userID) {
    return this.afs.collection('notifications').ref.where("receiver_userID", "==", userID).get();
  }

  createLikeNotification(listingID, userID, post) {
    return this.userDataService.getUserDetails(userID).then(userDetails => {
      return this.afs.collection(`notifications`).add({
        listingID: listingID,
        sender_userID: userID,
        sender_firstname: userDetails.data()["firstName"],
        sender_lastname: userDetails.data()["lastName"],
        receiver_userID: post["donorID"],
        createdAt: Date.now(),
        read: false,
        type: "like",
      }).then(res => {
        this.afs.collection('notifications').doc(res.id).set({notificationID:res.id} , {merge:true});
      })
    })
  }

  deleteLikeNotification(listingID, userID) {
      return this.afs.collection(`notifications`).ref.where("sender_userID", "==", userID)
      .where("listingID", "==", listingID)
      .get().then(res => { 
      res.forEach( res => { 
        this.afs.collection(`notifications`).doc(`${res.id}`).delete(); 
      })
    })
  }
}
