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

        this.chatService.getAllChatrooms(this.currentUser.uid).then(chatrooms => {
          chatrooms.forEach(chatroom => {
            this.addNameToChatroom(chatroom);
          });
        })
          
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
    let chatroomData = chatroom.data();
    let chatMembers = chatroomData["members"];
    let receiver;
    // check is possible since only 2 members
    if (chatMembers[0] === this.currentUser.uid) {
      receiver = chatMembers[1];
    } else {
      receiver = chatMembers[0];
    }
    this.userDataService.getUserDetails(receiver).then(receiverDetails => {
      let receiverData = receiverDetails.data();
      chatroomData["firstName"] = receiverData.firstName;
      chatroomData["lastName"] = receiverData.lastName;
      chatroomData["receiverID"] = receiverData.userID;
      this.userDataService.getProfileImg(receiverData.userID).subscribe(url => {
        this.showProfileImg(receiverData.userID, url);
        chatroomData["receiverPhotoUrl"] = url;
      })

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

  closeChatrooms() {
    this.router.navigate(['marketplace'])
  }

  filterByAsReceiver() {
    return this.chatService.getChatRoomsByStatus(this.currentUser.uid, false).then(chatrooms => {
      this.chatrooms = [];
      chatrooms.forEach(chatroom => {
        this.addNameToChatroom(chatroom);
      })
    })
  }

  showProfileImg(userID:string, url:string) {
    const frame = document.getElementById(`frame-${userID}`);
    if (url.length > 0) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
    }
  }

}
