import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationsService } from '../notif/notifications.service';

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
      requestStatus: "none"
    }).then(()=> {
      return this.sendMessage(listingID, groupID, message, createdBy, receiver);
    });
  }

  getChatroom(groupID: string) {
    return this.afs.collection("chatrooms").doc(groupID).valueChanges();
  }

  sendMessage(listingID: string, groupID: string, message: string, sentBy: string, receiver: string) {
    let sentAt = new Date();
    return this.afs.collection("messages").doc(groupID).collection("messages").add({
      message: message,
      sentAt: sentAt,
      sentBy: sentBy
    })
    .then(() => {
      return this.updateChatroomMessage(groupID, message, sentBy, sentAt);
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
    return this.afs.collection("chatrooms").doc(groupID).set({requestStatus: requestStatus}, {merge: true})
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
