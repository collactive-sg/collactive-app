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
    return this.afs.collection('notifications', ref => { return ref.where("receiver_userID", "==", userID).orderBy('createdAt', 'desc')}).valueChanges();
  }

  readNotification(notifId) {
    return this.afs.collection('notifications').doc(`${notifId}`).set({"read": true}, {merge:true})
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

  createChatNotification(listingID, sender_userID, receiver_userID, message) {
    return this.userDataService.getUserDetails(sender_userID).then(userDetails => {
      return this.afs.collection(`notifications`).add({
        listingID: listingID,
        sender_userID: sender_userID,
        sender_firstname: userDetails.data()["firstName"],
        sender_lastname: userDetails.data()["lastName"],
        receiver_userID: receiver_userID,
        createdAt: Date.now(),
        read: false,
        type: "chat",
        message: message
      }).then(res => {
        return this.afs.collection('notifications').doc(res.id).set({notificationID:res.id} , {merge:true});
      })
    })
  }
}
