import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dietary-restrictions',
  templateUrl: './dietary-restrictions.component.html',
  styleUrls: ['./dietary-restrictions.component.css']
})
export class DietaryRestrictionsComponent implements OnInit {

  preferences = ["Halal", "Vegan", "Vegetarian", "Kosher", "Pescatarian", "Dairy-free", "Gluten-free", "Nut-free", "Health supplements"]
  
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['profile-setup/child-profile']);
  }

}
