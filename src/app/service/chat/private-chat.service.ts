import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PrivateChatService {

  constructor(private afs: AngularFirestore) { }

  createChatGroup(listingID: string, createdBy: string, members, 
    type: string, message: string) {
    
    let groupID = listingID + createdBy; 
    
    return this.afs.collection("chatrooms").doc(groupID).set({
      createdAt: new Date(),
      createdBy: createdBy,
      members: members,
      modifiedAt: new Date(),
      type: type,
      listingID: listingID
    }).then(()=> {
      return this.sendMessage(groupID, message, createdBy);
    });
  }

  getChatGroup(groupID: string) {
    return this.afs.collection("chatrooms").doc(groupID).get();
  }

  sendMessage(groupID: string, message: string, sentBy: string) {
    return this.afs.collection("messages").doc(groupID).collection("messages").add({
      message: message,
      sentAt: new Date(),
      sentBy: sentBy
    })
  }

  getMessages(groupID: string) {
    return this.afs.collection("messages").doc(groupID).collection("messages").ref.orderBy("sentAt").get();
  }

}
