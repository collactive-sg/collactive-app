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

        this.chatService.getAllChatrooms(this.currentUser.uid).then(chatrooms => 
          chatrooms.forEach(chatroom => this.chatrooms.push(chatroom.data())
        ));
        
      })
    }})
  }

  onClickChatroom(chatroom) {
    let receiverID = chatroom["members"][0] === this.currentUser.uid 
      ? chatroom["members"][1] 
      : chatroom["members"][0];
    this.router.navigate([`chat/${chatroom.listingID}/${receiverID}`])
  }

}
