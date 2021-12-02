import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/service/notif/notifications.service';

@Component({
  selector: 'app-notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.css']
})
export class NotificationBoxComponent implements OnInit {

  @Input() senderFirstName:string;
  @Input() senderLastName:string;
  @Input() type:string;
  @Input() dateOfNotification;
  @Input() notificationID:string;
  @Input() listingID;
  @Input() isRead;
  @Input() senderID:string;


  constructor(
    private router: Router,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit(): void {
  }

  convertNotificationTimeToString() {
    if ((((new Date().getTime() - this.dateOfNotification)/1000)/3600) < 1) {
      let num = Math.round(((new Date().getTime() - this.dateOfNotification)/1000)/60);
      return num < 2 ? `1 minute ago` : `${num} minutes ago`
    } else if ((((new Date().getTime() - this.dateOfNotification)/1000)/3600) < 25) {
      let num = Math.round(((new Date().getTime() - this.dateOfNotification)/1000)/3600);
      return num == 1 ? `${num} hour ago` : `${num} hours ago`
    } else {
      let num = Math.round((((new Date().getTime() - this.dateOfNotification)/1000)/3600)/24);
      return num == 1 ? `${num} day ago` : `${num} days ago`

    }
  }

  goToNotification() {
    if (this.type === 'like') {
      this.router.navigate([`listing/${this.listingID}`])
    } else if (this.type === 'chat') {
      this.router.navigate([`chat/${this.listingID}/${this.senderID}`])
    }
    this.notificationService.readNotification(this.notificationID);
  }

}
