import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PrivateChatService } from 'src/app/service/chat/private-chat.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-chatrooms',
  templateUrl: './chatrooms.component.html',
  styleUrls: ['./chatrooms.component.css']
})
export class ChatroomsComponent implements OnInit {

  currentUser;
  currentUserDetails;

  chatrooms = {};
  allChatrooms = {};
  chatroomsLength = 0;

  receiverID: string;

  constructor(
    private router: Router,
    private auth: AuthService,
    private chatService: PrivateChatService,
    private userDataService: UserDataService,
    private listingService: ListingService
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
              chatrooms.forEach(chatroom => {
                chatroom["isListingOwner"] = (chatroom["members"][0] === this.currentUser.uid);
                this.listingService.getListingByID(chatroom["listingID"]).subscribe(listingDetails => {
                  if (listingDetails) {
                    chatroom["numberOfPacks"] = listingDetails["numberOfPacks"];
                    chatroom["typeOfMilk"] = listingDetails["typeOfMilk"];
                    chatroom["volumePerPack"] = listingDetails["volumePerPack"];
                  } else {} // listing deleted
                  this.addNameToChatroom(chatroom);
                })
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
      let receiverData = receiverDetails.data();
      chatroomData["firstName"] = receiverData.firstName;
      chatroomData["lastName"] = receiverData.lastName;
      chatroomData["receiverID"] = receiverData.userID;
      this.userDataService.getProfileImg(receiverData.userID).subscribe(url => {
        this.showProfileImg(receiverData.userID, url);
        chatroomData["receiverPhotoUrl"] = url;
      })

      this.chatrooms[chatroomData["listingID"] + receiver] = chatroomData;
      this.allChatrooms[chatroomData["listingID"] + receiver] = chatroomData;
      this.chatroomsLength = Object.keys(this.chatrooms).length;
    })
  }

  filterByAsDonor(isDonor: boolean) {
    this.chatrooms = {};
    if (isDonor) {
      for (const [key, chatroom] of Object.entries(this.allChatrooms)) {
        var donorID = chatroom["members"][0];
        var receiverID = chatroom["members"][1];
        if (donorID === this.currentUser.uid) {
          this.chatrooms[chatroom["listingID"] + receiverID] = chatroom;
        }
      }
      this.chatroomsLength = Object.keys(this.chatrooms).length;
    } else {
      for (const [key, chatroom] of Object.entries(this.allChatrooms)) {
        var receiverID = chatroom["members"][1];
        if (receiverID === this.currentUser.uid) {
          this.chatrooms[chatroom["listingID"] + receiverID] = chatroom;
        }
      }
      this.chatroomsLength = Object.keys(this.chatrooms).length;
    }
  }

  clearFilters() {
    this.chatrooms = this.allChatrooms;
  }

  showProfileImg(userID:string, url:string) {
    const frame = document.getElementById(`frame-${userID}`);
    if (url.length > 0) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
    }
  }

  asIsOrder() {
    return 1;
  }

}
