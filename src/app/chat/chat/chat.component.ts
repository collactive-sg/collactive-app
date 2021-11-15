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
  childrenDetails;
  isCompleteProfile;
  isEmailVerified;

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
  isListingOwner: boolean;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private chatService: PrivateChatService,
    private userDataService: UserDataService,
    private listingService: ListingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.listingID = params['lid'];
      this.receiverID = params['uid'];
      this.members.push(this.receiverID); 
    });

    this.auth.getUserAuthState().onAuthStateChanged((user) => {
     if (user) {
      this.currentUser = user;
      this.isEmailVerified = this.currentUser.emailVerified;

      this.userDataService.getUserDetails(this.currentUser.uid).then(res => {
        
        this.currentUserDetails = res.data();
        this.userDataService.getChildren(user.uid).then(res => {
          this.childrenDetails = [];
          res.forEach(child => this.childrenDetails.push(child.data()));
          this.isCompleteProfile = this.checkIfCompleteProfile(this.currentUserDetails, this.childrenDetails);
        })
        this.members.push(this.currentUser.uid);

        this.listingService.getListingByID(this.listingID).pipe().subscribe((listing: any) => {
          this.listingDetails = listing;
  
          this.isListingOwner = listing.donorID === this.currentUser.uid
          if (this.isListingOwner) {
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
    
    if (this.notifyUserVerification()) {
      return;
    }

    if (this.currentGroupDetails === undefined || this.currentGroupDetails.members === undefined) {
      return this.chatService.createChatroom(this.listingID, this.currentUser.uid, this.members, "private", message).then(() => {
        this.newMessage = '';
        // return this.getMessagesfromGroup();
      });
    } else {
      return this.chatService.sendMessage(this.listingID, this.currentGroupID, message, this.currentUser.uid, this.receiverID, this.isListingOwner).then(() => {
        this.newMessage = '';
        // return this.getMessagesfromGroup();
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
            this.userDataService.getUserDetails(this.receiverID).then(userDetails => {
              if (userDetails) {
                this.receiverDetails = userDetails.data();
                messageWithName.senderFirstName = this.receiverDetails.firstName;
                messageWithName.senderLastName = this.receiverDetails.lastName;
              }
            })
          }
          this.messages.push(messageWithName);
        })
      }
    })
  }

  // for notifications
  updateLastSeen() {
    if (this.notifyUserVerification()) {
      return;
    }
    return this.chatService.updateChatRoomLastSeen(this.currentGroupID, this.isListingOwner, this.currentUser.uid);
  }

  // below are functions for request listing
  handleListingRequest(donorRequestAction: string) {
    if (this.notifyUserVerification()) {
      return;
    }
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

  // checking for valid profile settings start here
  navigateToProfileSettings() {
    this.router.navigate(["/profile-settings"]);
  }

  resendVerificationEmail() {
    this.auth.resendEmailVerification(this.currentUser);
    window.alert("Email verfication sent and will arrive shortly! Please chack your email for it.");
  }

  checkIfCompleteProfile(userDetails, childrenDetails) {
    var firstName = userDetails["firstName"];
    var lastName = userDetails["lastName"];
    var lifestyleInfo = userDetails["lifestyle-info"];
    var dietaryPreferences = userDetails["dietary-restrictions"];
    var areaOfResidency = userDetails["areaOfResidency"];
    var dateOfBirth = userDetails["dateOfBirth"];
    if (firstName === undefined ||
      lastName === undefined || 
      lifestyleInfo === undefined || 
      dietaryPreferences === undefined || 
      areaOfResidency === undefined ||
      dateOfBirth === undefined ||
      childrenDetails === undefined) {
        return false;
      }
    if (lifestyleInfo.length < 3) {
      return false;
    }
    if (dietaryPreferences.length < 8) {
      return false;
    }
    if (childrenDetails.length < 1) {
      return false;
    }
    return true;
  }

  notifyUserVerification() {
    // additional check if user is not verified. returns true if any violation made
    if (!this.isEmailVerified) {
      if (window.confirm("Your email is not verified. Please verify your email before chatting. Would you like a email verification resent?")) {
        this.resendVerificationEmail();
        return true;
      }
    } else if (!this.isCompleteProfile) {
      if (window.confirm("Your profile is not complete. Please complete your profile in profile settings before chatting.")) {
        this.navigateToProfileSettings();
      }
      return true;
    } else {
      return false;
    }
  }
}
