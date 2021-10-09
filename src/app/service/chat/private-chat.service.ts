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
      listingID: listingID
    }).then(()=> {
      return this.sendMessage(listingID, groupID, message, createdBy, receiver);
    });
  }

  getChatroom(groupID: string) {
    return this.afs.collection("chatrooms").doc(groupID).get();
  }

  sendMessage(listingID: string, groupID: string, message: string, sentBy: string, receiver: string) {
    return this.afs.collection("messages").doc(groupID).collection("messages").add({
      message: message,
      sentAt: new Date(),
      sentBy: sentBy
    }).then(() => {
      return this.notificationsService.createChatNotification(listingID, sentBy, receiver, message);
    })
  }

  getMessages(groupID: string) {
    return this.afs.collection("messages").doc(groupID).collection("messages").ref.orderBy("sentAt", "asc").get();
  }

  getAllChatrooms(userID: string) {
    return this.afs.collection("chatrooms").ref.where('members', 'array-contains', userID).get();
  }

}
