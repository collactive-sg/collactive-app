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
  @Input() dateOfNotification:number;
  @Input() notificationID:string;
  @Input() listingID;


  constructor(
    private router: Router,
    private notificationService: NotificationsService,
  ) { }

  ngOnInit(): void {
  }

  convertNotificationTimeToString() {
    if ((((new Date().getTime() - this.dateOfNotification)/1000)/3600) < 1) {
      return `${Math.round(((new Date().getTime() - this.dateOfNotification)/1000)/60)} minutes ago`
    } else if ((((new Date().getTime() - this.dateOfNotification)/1000)/3600) < 25) {
      return `${Math.round(((new Date().getTime() - this.dateOfNotification)/1000)/3600)} hours ago`
    } else {
      return `${Math.round(((new Date().getTime() - this.dateOfNotification)/1000)/3600 * 24)} hours ago`
    }
  }

  goToNotification() {
    this.router.navigate([`listing/${this.listingID}`])
    this.notificationService.readNotification(this.notificationID);
  }

}
