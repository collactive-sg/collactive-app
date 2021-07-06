import { Injectable, NgZone } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, public ngZone: NgZone) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.auth
          .getUserAuthState()
          .onAuthStateChanged((user) => {
              if (user) {
                  resolve(true);
              } else {
                  console.log("User is not logged in");
                  this.ngZone.run(() => {
                      this.router.navigate(["/login"]);
                  })
                  resolve(false);
              }
          });
  });
  }
  
}
