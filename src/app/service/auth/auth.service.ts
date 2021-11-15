import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import {
    AngularFirestore
} from "@angular/fire/firestore"; 

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: any;

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    return await this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        res.user.sendEmailVerification();
        this.addFirstUser(res.user.email, res.user.uid)
      })
  }

  async resendEmailVerification(user) {
    return await user.sendEmailVerification();
  }

  async addFirstUser(email, uid) {
    return await this.afs.collection("users").doc(uid).set({
      email: email,
      isFirstTimeUser: true,
      userID: uid
    });
  }

  async sendPasswordResetEmail(email) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  getUserAuthState() {
    return this.afAuth;
  }

  async logout() {
    return await this.afAuth.signOut();
  }
}
