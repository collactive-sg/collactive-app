import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from "@angular/fire/firestore"; 
import { Router } from  "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   user: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
  ) { 

    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        // localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        // localStorage.setItem('user', null);
      }
    })
  }

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    return await this.afAuth.createUserWithEmailAndPassword(email, password).then(
      res => this.addFirstUser(res.user.email, res.user.uid)
    )
  }

  async addFirstUser(email, uid) {
    return await this.afs.collection('users').doc(uid).set({
      'email' : email,
      'isFirstTimeUser' : true
    });
  }

  getUserAuthState() {
    return this.afAuth;
  }

}
