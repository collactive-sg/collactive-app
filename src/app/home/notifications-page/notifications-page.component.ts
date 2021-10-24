import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { NotificationsService } from 'src/app/service/notif/notifications.service';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit {

  currentUser;
  isDonor;

  notifications = [];
  notificationsObervable;

  constructor(
    private auth: AuthService,
    private notificationService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.auth.getUserAuthState().onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
          this.notificationService.getNotificationsByUserID(this.currentUser.uid).pipe().subscribe(res => {
            if (res) {
              this.notifications = [];
              res.forEach(notif => {
                this.notifications.push(notif);
              })
              this.notifications.sort((x,y)=> x.read === y.read ? 0 : x.read ? 1 : -1)
            }
          });
        }
      });
  }

  readAllNotifications() {
    if (this.notifications.length > 0) {
      this.notifications.forEach(notif => this.notificationService.readNotification(notif.notificationID));
    }
  }
}
