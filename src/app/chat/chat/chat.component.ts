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
  listingDetails;

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
          this.listingDetails = listing;
          listingOwnerID = listing.donorID;
          if (listingOwnerID === this.currentUser.uid) {
            this.currentGroupID = this.listingID + this.receiverID;
          } else {
            this.currentGroupID = this.listingID + this.currentUser.uid;
          }
          this.getGroupDetails();
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

  getGroupDetails() {
    return this.chatService.getChatroom(this.currentGroupID).pipe().subscribe(groupDetails => {
      if (groupDetails) {
        this.currentGroupDetails = groupDetails;
        this.getMessagesfromGroup();
      }
    })
  }

  // updates the list of messages
  getMessagesfromGroup() {
    return this.chatService.getMessages(this.currentGroupID).pipe().subscribe(messages => {
      this.messages = [];
      if (messages) {
        messages.forEach(message => {
          let messageWithName = message;
          if (message.sentBy === this.currentUser.uid) {
            messageWithName.senderFirstName = this.currentUserDetails.firstName;
            messageWithName.senderLastName = this.currentUserDetails.lastName;
          } else {
            messageWithName.senderFirstName = this.receiverDetails.firstName;
            messageWithName.senderLastName = this.receiverDetails.lastName;
          }
          this.messages.push(messageWithName);
        })
      }
    })
  }

  onPrevButtonClick() {
    this.router.navigate([`listing/${this.listingID}`]);
  }

  // below are functions for request listing
  handleListingRequest(donorRequestAction: string) {
    if (this.currentUser.uid !== this.listingDetails.donorID) {
      this.changeRequestStatusAsReceiver();
    } else {
      this.changeListingRequestStatusAsDonor(donorRequestAction);
    }
    return this.getGroupDetails();
  }

  changeRequestStatusAsReceiver() {
    if (this.currentGroupDetails.requestStatus === "none") {
      this.chatService.updateChatroomRequest(this.currentGroupID, "requested");
      let recentMessage = "Requested for your donation";
      this.send(recentMessage);
      this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
    }
  }

  changeListingRequestStatusAsDonor(donorRequestAction: string) {
    if (this.currentGroupDetails.requestStatus === "requested") {
      if (donorRequestAction === "accept") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "accepted");
        this.listingService.editlisting({"status": "accepted"}, this.listingID);
        let recentMessage = "Accepted your request for donation";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
      } else if (donorRequestAction === "reject" || donorRequestAction === "reset") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "none");
        let recentMessage = "Rejected your request for donation";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
      }
    } else if (this.currentGroupDetails.requestStatus === "accepted") {
      if (donorRequestAction === "collacted") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "collacted");
        let recentMessage = "Awesome! The donation is collacted";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
        this.listingService.editlisting({"status": "collacted"}, this.listingID);
      } else if (donorRequestAction === "reset") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "none");
        let recentMessage = "Reset the donation listing";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
        this.listingService.editlisting({"status": "live"}, this.listingID);
      }
    } else if (this.listingDetails.status === "collacted") {
      if (donorRequestAction === "reset") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "none");
        let recentMessage = "Reset the donation listing";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
        this.listingService.editlisting({"status": "live"}, this.listingID);
      }
    }
  }
  closeChat() {
    this.router.navigate(['chatrooms']);
  }
}
