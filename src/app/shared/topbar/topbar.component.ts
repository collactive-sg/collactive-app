import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() isShowBackButton;
  @Input() isShowMenu;
  @Input() isShowChats;
  @Input() backButtonPath;

  constructor(
    private modalService: NgbModal, 
    private router: Router) { }

  ngOnInit(): void {
  }
  openSidebar() {
    const modalRef = this.modalService.open(SidebarComponent);
  }

  navigateToBackPath(){
    this.router.navigate([this.backButtonPath]);
  }

  openChats() {
    this.router.navigate(["chatrooms"]);
  }

}
