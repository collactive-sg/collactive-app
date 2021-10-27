import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationsService } from '../notif/notifications.service';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PrivateChatService {

  constructor(
    private afs: AngularFirestore,
    private notificationsService: NotificationsService
  ) { }

  createChatroom(listingID: string, createdBy: string, members, 
    type: string, message: string) {
    
    let groupID = listingID + createdBy; 
    let receiver = members[0];
    
    return this.afs.collection("chatrooms").doc(groupID).set({
      createdAt: new Date(),
      createdBy: createdBy,
      members: members,
      modifiedAt: new Date(),
      type: type,
      listingID: listingID,
      requestStatus: "none",
      donorLastSeen: new Date(),
      receiverLastSeen: new Date(),
      recentMsgsForDonor: 0,
      recentMsgsForReceiver: 0,
    }, {merge: true}).then(()=> {
      return this.sendMessage(listingID, groupID, message, createdBy, receiver, false);
    });
  }

  getChatroom(groupID: string) {
    return this.afs.collection("chatrooms").doc(groupID).valueChanges();
  }

  sendMessage(listingID: string, groupID: string, message: string, sentBy: string, receiver: string, isListingOwner: boolean) {
    let sentAt = new Date();
    return this.afs.collection("messages").doc(groupID).collection("messages").add({
      message: message,
      sentAt: sentAt,
      sentBy: sentBy
    })
    .then(() => {
      return this.updateChatroomMessage(groupID, message, sentBy, sentAt);
    }).then(() => {
      return this.updateChatroomRecentMsgCount(groupID, isListingOwner);
    })
    .then(() => {
      return this.notificationsService.createChatNotification(listingID, sentBy, receiver, message);
    })
  }

  updateChatroomMessage(groupID: string, message: string, sentBy: string, modifiedAt) {
    return this.afs.collection("chatrooms").doc(groupID).set({
      modifiedAt: modifiedAt,
      recentMessage: {
        message: message,
        sentBy: sentBy
      }
    }, {merge: true})
  }

  updateChatroomRequest(groupID: string, requestStatus: string) {
    return this.afs.collection("chatrooms").doc(groupID).set({requestStatus: requestStatus}, {merge: true});
  }

  // chat notifications cleanup related function
  updateChatRoomLastSeen(groupID: string, isDonor: boolean, userID: string) {
    let lastSeen = new Date();
    if (isDonor) {
      return this.afs.collection("chatrooms").doc(groupID)
      .set({donorLastSeen: lastSeen, recentMsgsForDonor: 0}, {merge: true})
      .then(() => {
        return this.notificationsService.readNotificationsBeforeLastSeen(userID, lastSeen);
      });
    } else {
      return this.afs.collection("chatrooms").doc(groupID)
      .set({receiverLastSeen: new Date(), recentMsgsForReceiver: 0}, {merge: true})
      .then(() => {
        return this.notificationsService.readNotificationsBeforeLastSeen(userID, lastSeen);
      });
    }
  }

  updateChatroomRecentMsgCount(groupID: string, isListingOwner: boolean) {
    const increment = firebase.firestore.FieldValue.increment(1);
    if (isListingOwner) {
      return this.afs.collection("chatrooms").doc(groupID).update({recentMsgsForReceiver: increment});
    } else {
      return this.afs.collection("chatrooms").doc(groupID).update({recentMsgsForDonor: increment});
    }
  }

  getMessages(groupID: string) {
    return this.afs.collection("messages").doc(groupID).collection("messages", ref => {return ref.orderBy('sentAt', 'asc')}).valueChanges();
  }

  getAllChatrooms(userID: string) {
    return this.afs.collection("chatrooms").ref.orderBy("modifiedAt", "desc").where('members', 'array-contains', userID).get();
  }

  getChatRoomsByStatus(userID: string, isDonor: boolean) {
    if (isDonor) {
      return this.afs.collection("chatrooms").ref
      .where('createdBy', '!=', userID).where('members', 'array-contains', userID)
      .orderBy('createdBy')
      .orderBy("modifiedAt", "desc").get();
    } else {
      return this.afs.collection("chatrooms").ref
      .where('createdBy', '==', userID).where('members', 'array-contains', userID)
      .orderBy("modifiedAt", "desc").get();
    }
  }

}
