import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeInfoModalComponent } from 'src/app/profile-setup/type-info-modal/type-info-modal.component';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UserDataService } from 'src/app/service/user-data/user-data.service';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.css']
})
export class ChangeStatusComponent implements OnInit {

  isDonor;
  currentUser;
  constructor(
    private modalService: NgbModal,
    private userDataService: UserDataService,
    private auth: AuthService,
    private router: Router,
  ) { 
    this.auth.getUserAuthState()
      .onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = ''
        }
        this.userDataService.getUserDoc(this.currentUser.uid).subscribe(res => {
          this.isDonor = res['isDonor']
        })
        this.userDataService.getProfileImg(this.currentUser.uid).subscribe(res => {
          this.showProfileImg(res);
        })
      })
  }

  showProfileImg(url:string) {
    const frame = document.getElementById("frame");
    if (url.length > 0) {
      frame.style.backgroundImage = `url(${url})`;
      frame.style.backgroundSize = `cover`;
    }
  }

  ngOnInit(): void { }

  openInfoModal() {
    this.modalService.open(TypeInfoModalComponent, { centered: true });
  }

  updateDonorStatus() {
    this.isDonor = !this.isDonor
    this.userDataService.updateUserDoc(this.currentUser.uid, {"isDonor": this.isDonor});
  }

  onClickChangeStatus() {
    if (confirm("Are you sure you want to change your status?")) {
      this.updateDonorStatus()
    }
  }

  onClickBack() {
    this.router.navigate(['/home'])
  }

}
