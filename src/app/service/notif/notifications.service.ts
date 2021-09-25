import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getNotificationsByUserID(userID) {
    return this.afs.collection('notifications').ref.where("receiver_userID", "==", userID).get();
  }
}
