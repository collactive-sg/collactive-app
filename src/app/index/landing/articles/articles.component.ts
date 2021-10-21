import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
  ) { 
    this.auth.getUserAuthState().authState.subscribe((user) => {
      if (user) { this.router.navigate(['/home']);}
    })
  }

  ngOnInit(): void {
  }

}
