import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-type-info-modal',
  templateUrl: './type-info-modal.component.html',
  styleUrls: ['./type-info-modal.component.css']
})
export class TypeInfoModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
  }

}
