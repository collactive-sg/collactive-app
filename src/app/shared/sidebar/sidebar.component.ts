import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';
import { UserDataService } from '../../service/user-data/user-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  currentUser:any;
  currUserFullName:string;
  isDonor:boolean;
  subscriptions:Subscription[] = [];
  
  constructor(
    public activeModal: NgbActiveModal,
    private auth: AuthService,
    private userDataService: UserDataService,
    private router: Router) { 
      
    }

  ngOnInit(): void {
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
         this.currentUser = user;
        }
        this.subscriptions.push(this.userDataService.getProfileImg(this.currentUser.uid).pipe().subscribe(
          url => this.showProfileImg(url),
        ))
        this.userDataService.getUserDetails(this.currentUser.uid).then((res:any) => {
          var user = res.data()
          this.currUserFullName = user.firstName + " " + user.lastName;
          this.isDonor = user.isDonor;
        })
      })
  }
  

  close() {
    this.activeModal.close();
  }
  
  showProfileImg(url) {
      // const frame = document.getElementById('frame');
      // if (url) {
      //   frame.style.backgroundImage = `url(${url})`;
      //   frame.style.backgroundSize = `cover`;
      // }

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  navigateToPath(path) {
    this.close();
    this.router.navigate([path]);
  }

  logout() {
    this.close();
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
