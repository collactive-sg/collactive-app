import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PrivateChatService } from 'src/app/service/chat/private-chat.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';


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

  windowHistory;

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
        this.listingService.getListingByID(this.listingID).pipe().subscribe((listing: any) => {
          listingOwnerID = listing.donorID;
          if (listingOwnerID === this.currentUser.uid) {
            this.currentGroupID = this.listingID + this.receiverID;
          } else {
            this.currentGroupID = this.listingID + this.currentUser.uid;
          }
          this.chatService.getChatroom(this.currentGroupID).subscribe(groupDetails => {
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
      return this.chatService.createChatroom(this.listingID, this.currentUser.uid, this.members, "private", message).then(() => {
        this.newMessage = '';
        return this.getMessagesfromGroup();
      });
    } else {
      return this.chatService.sendMessage(this.listingID, this.currentGroupID, message, this.currentUser.uid, this.receiverID).then(() => {
        this.newMessage = '';
        return this.getMessagesfromGroup();
      })
    }
  }

  // updates the list of messages
  getMessagesfromGroup() {
    return this.chatService.getMessages(this.currentGroupID).then(messages => {
      this.messages = [];
      messages.forEach(message => {
        let messageWithName = message.data();
        console.log(message.data())
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
