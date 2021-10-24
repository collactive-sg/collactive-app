import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  @Input() isShowBackButton;
  @Input() isShowMenu;

  constructor(
    private modalService: NgbModal, 
    private _location: Location
  ) { }

  ngOnInit(): void {
  }
  open() {
    const modalRef = this.modalService.open(SidebarComponent);
  }

  navigateToBackPath(){
    this._location.back();
  }
}
