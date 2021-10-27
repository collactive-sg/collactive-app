import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PrivateChatService } from 'src/app/service/chat/private-chat.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-chatrooms',
  templateUrl: './chatrooms.component.html',
  styleUrls: ['./chatrooms.component.css']
})
export class ChatroomsComponent implements OnInit {

  currentUser;
  currentUserDetails;

  chatrooms = [];
  receiverID: string;
  isListingOwner: boolean;


  constructor(
    private router: Router,
    private auth: AuthService,
    private chatService: PrivateChatService,
    private userDataService: UserDataService
  ) { }

  ngOnInit(): void {
    this.auth.getUserAuthState().onAuthStateChanged((user) => {
      if (user) {
       this.currentUser = user;
 
       this.userDataService.getUserDetails(this.currentUser.uid).then(res => {
         
        this.currentUserDetails = res.data();

        this.chatService.getAllChatrooms(this.currentUser.uid).subscribe(
          (chatrooms) => {
            if (chatrooms) {
              this.chatrooms = [];
              chatrooms.forEach(chatroom => {
                this.addNameToChatroom(chatroom);
                this.isListingOwner = (chatroom["members"][0] === this.currentUser.uid);
              });
            }
          }
        )
      });
        
      }
    })
  }

  onClickChatroom(chatroom) {
    let receiverID = chatroom["members"][0] === this.currentUser.uid 
      ? chatroom["members"][1] 
      : chatroom["members"][0];
    this.router.navigate([`chat/${chatroom.listingID}/${receiverID}`])
  }

  addNameToChatroom(chatroom) {
    let chatroomData = chatroom;
    let chatMembers = chatroomData["members"];
    let receiver;
    // check is possible since only 2 members
    if (chatMembers[0] === this.currentUser.uid) {
      receiver = chatMembers[1];
    } else {
      receiver = chatMembers[0];
    }
    this.userDataService.getUserDetails(receiver).then(receiverDetails => {
      chatroomData["firstName"] = receiverDetails.data().firstName;
      chatroomData["lastName"] = receiverDetails.data().lastName;
      this.chatrooms.push(chatroomData);
    })
  }

  filterByAsDonor() {
    return this.chatService.getChatRoomsByStatus(this.currentUser.uid, true).then(chatrooms => {
      this.chatrooms = [];
      chatrooms.forEach(chatroom => {
        this.addNameToChatroom(chatroom);
      })
    })
  }

  filterByAsReceiver() {
    return this.chatService.getChatRoomsByStatus(this.currentUser.uid, false).then(chatrooms => {
      this.chatrooms = [];
      chatrooms.forEach(chatroom => {
        this.addNameToChatroom(chatroom);
      })
    })
  }

}
