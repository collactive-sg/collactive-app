import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() isShowBackButton;
  @Input() isShowMenu;
  @Input() isShowChats;
  @Input() chatCount;

  constructor(
    private modalService: NgbModal, 
    private _location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  openSidebar() {
    const modalRef = this.modalService.open(SidebarComponent);
  }

  navigateToBackPath(){
    this._location.back();
  }

  openChats() {
    if (this.chatCount) {
      console.log(this.chatCount);
    }
    this.router.navigate(["chatrooms"]);
  }

}
