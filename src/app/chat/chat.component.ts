import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { PrivateChatService } from '../service/chat/private-chat.service';
import { ListingService } from '../service/listing/listing.service';
import { UserDataService } from '../service/user-data/user-data.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentUser;
  currentUserDetails;

  // the one receiving the message
  receiverID: string;
  receiverDetails;

  members = [];
  newMessage = '';

  listingID;

  currentGroupID: string;
  currentGroupDetails;

  messages = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private chatService: PrivateChatService,
    private userDataService: UserDataService,
    private listingService: ListingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.listingID = params['lid'];
      this.receiverID = params['uid'];
      this.members.push(this.receiverID); 
    });

    this.userDataService.getUserDetails(this.receiverID).then(userDetails => {
      if (userDetails) {
        this.receiverDetails = userDetails.data();
      }
    })

    this.auth.getUserAuthState().onAuthStateChanged((user) => {
     if (user) {
      this.currentUser = user;

      this.userDataService.getUserDetails(this.currentUser.uid).then(res => {
        
        this.currentUserDetails = res.data();
        this.members.push(this.currentUser.uid);

        let listingOwnerID;
        this.listingService.getListingByID(this.listingID).subscribe(res => {
          listingOwnerID = res;
          if (listingOwnerID === this.currentUser.uid) {
            this.currentGroupID = this.listingID + this.receiverID;
          } else {
            this.currentGroupID = this.listingID + this.currentUser.uid;
          }
          this.chatService.getChatGroup(this.currentGroupID).subscribe(groupDetails => {
            if (groupDetails) {
              this.currentGroupDetails = groupDetails.data();
              this.getMessagesfromGroup();
            }
          })
        })
      })
     }})
  }

  send(message) {
    if (this.currentGroupDetails === undefined) {
      return this.chatService.createChatGroup(this.listingID, this.currentUser.uid, this.members, "private", message);
    } else {
      return this.chatService.sendMessage(this.currentGroupID, message, this.currentUser.uid).then(() => {
        return this.getMessagesfromGroup();
      })
    }
  }

  getMessagesfromGroup() {
    return this.chatService.getMessages(this.currentGroupID).then(messages => {
      this.messages = [];
      messages.forEach(message => {
        let messageWithName = message.data();
        if (message.data().sentBy === this.currentUser.uid) {
          messageWithName.senderFirstName = this.currentUserDetails.firstName;
          messageWithName.senderLastName = this.currentUserDetails.lastName;
        } else {
          messageWithName.senderFirstName = this.receiverDetails.firstName;
          messageWithName.senderLastName = this.receiverDetails.lastName;
        }
        this.messages.push(messageWithName);
      })
    })
  }

  onPrevButtonClick() {
    this.router.navigate([`listing/${this.listingID}`]);
  }

}
