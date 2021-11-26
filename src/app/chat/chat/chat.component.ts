import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { PrivateChatService } from 'src/app/service/chat/private-chat.service';
import { ListingService } from 'src/app/service/listing/listing.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';
import { Location } from '@angular/common';

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

  isDonor:boolean;
  listingID;
  listingDetails;

  currentGroupID: string;
  currentGroupDetails;

  messages = [];
  isListingOwner: boolean;

  receiverProfilePhoto;
  senderProfilePhoto;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private chatService: PrivateChatService,
    private userDataService: UserDataService,
    private listingService: ListingService,
    private router: Router,
    private _location: Location
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
        this.userDataService.getProfileImg(userDetails.data()['userID']).subscribe(url => this.receiverProfilePhoto = url)
      }
    })

    this.auth.getUserAuthState().onAuthStateChanged((user) => {
     if (user) {
      this.currentUser = user;
      this.userDataService.getProfileImg(user.uid).subscribe(url => this.senderProfilePhoto = url)
      this.isEmailVerified = this.currentUser.emailVerified;
      

      this.userDataService.getUserDetails(this.currentUser.uid).then(res => {
        
        this.currentUserDetails = res.data();
        this.isDonor = this.currentUserDetails['isDonor']
        this.userDataService.getChildren(user.uid).then(res => {
          this.childrenDetails = [];
          res.forEach(child => this.childrenDetails.push(child.data()));
          this.isCompleteProfile = this.userDataService.checkIfCompleteProfile(this.isDonor, this.currentUserDetails, this.childrenDetails);
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

        this.userDataService.getUserDetails(this.receiverID).then(userDetails => {
          if (userDetails) {
            this.receiverDetails = userDetails.data();
          }
        });
      })
    }})
  }

  navigateToListing() {
    this.router.navigate([`listing/${this.listingID}`])
  }

  send(message:string) {
    if (this.notifyUserVerification()) {
      return;
    }
    
    if (message.trim().length < 1) {
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
    // this.notifyUserVerification()
    this.chatService.updateChatRoomLastSeen(this.currentGroupID, this.isListingOwner, this.currentUser.uid);
    this._location.back();
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
  convertExpressedDateTimestampToDateString() {
    if (this.listingDetails.dateExpressed !== undefined) {
      var dateExpressedDaysAgo = "on Invalid Date"
      if(!isNaN(this.listingDetails.dateExpressed)) {
        var diffInDays = (new Date().getTime() - this.listingDetails.dateExpressed) / (1000 * 3600 * 24);
        if (diffInDays == 0) {
          dateExpressedDaysAgo = "today";
        } else if (diffInDays > 0) {
          dateExpressedDaysAgo = `${Math.round(diffInDays)} days ago` 
        } 
      }
      return dateExpressedDaysAgo;
      
    } else {
      return "on Unknown Date"
    }
  }
  changeListingRequestStatusAsDonor(donorRequestAction: string) {
    if (this.listingDetails.status === "collacted") {
      if (donorRequestAction === "reset") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "none");
        let recentMessage = "Reset the donation listing";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
        this.listingService.editlisting({"status": "live"}, this.listingID);
      } else {
        window.prompt("This listing has already been collacted")
      }
    } else if (this.currentGroupDetails.requestStatus === "requested") {
      if (donorRequestAction === "accept") {
        this.chatService.updateChatroomRequest(this.currentGroupID, "accepted");
        this.listingService.editlisting({"status": "accepted"}, this.listingID);
        let recentMessage = "Accepted your request for donation";
        this.send(recentMessage);
        this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
      } else if (donorRequestAction === "reject" || donorRequestAction === "reset") {
        if (confirm(`Are you sure you want to ${donorRequestAction} this listing?`)) {
          this.chatService.updateChatroomRequest(this.currentGroupID, "none");
          let recentMessage = "Rejected your request for donation";
          this.send(recentMessage);
          this.chatService.updateChatroomMessage(this.currentGroupID, recentMessage, this.currentUser.uid, new Date());
        }
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

  notifyUserVerification() {
    // additional check if user is not verified. returns true if any violation made
    if (!this.isEmailVerified) {
      if (window.confirm("Your email is not verified. Please verify your email before chatting. Would you like a email verification resent?")) {
        this.resendVerificationEmail();
      }
      return true;
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
