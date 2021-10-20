import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.css']
})
export class BottomNavComponent implements OnInit {

  @Input() isDonor;
  constructor(private router: Router) { }

  ngOnInit(): void {}

  navigatePath(path: string) {
    this.router.navigate([path]);
  }

}
