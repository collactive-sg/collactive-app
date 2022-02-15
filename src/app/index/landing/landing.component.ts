import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';
import { MailchimpService } from 'src/app/service/mailchimp/mailchimp.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  subscribeData: any = <any>{};

  promptEvent: any;
  showButton = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private mailChimp: MailchimpService,
  ) { 
    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) { this.router.navigate(['/home']);}
    })
  }

  ngOnInit(): void {
  }

  onNextButtonClick() {
    this.router.navigate(['/login']);
  }

  subscribe(subscribeForm: NgForm) {
    console.log(this.subscribeData)
    if (subscribeForm.invalid) {
      return;
    }
    this.mailChimp.subscribeToList(this.subscribeData)
      .subscribe(res => {
        alert('Subscribed!');
      }, err => {
        console.log(err);
      })
  }


}
