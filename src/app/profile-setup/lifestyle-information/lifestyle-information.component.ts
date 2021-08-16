import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lifestyle-information',
  templateUrl: './lifestyle-information.component.html',
  styleUrls: ['./lifestyle-information.component.css']
})
export class LifestyleInformationComponent implements OnInit {

  didNotCheckAllBoxesMessage = "";
  
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    var checkBoxes = document.getElementsByClassName("form-check-input");
    for (let i = 0; i < checkBoxes.length; i++) {
      const element = checkBoxes[i] as HTMLInputElement;
      if (!element.checked) {
        //trigger modal
        this.didNotCheckAllBoxesMessage = "You did not check all boxes"
        return;
      }
    }
    this.router.navigate(['profile-setup/dietary-restrictions']);
  }

}
