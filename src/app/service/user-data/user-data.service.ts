import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore"; 

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  userDetails;
  
  constructor(
    private afs: AngularFirestore
  ) {
      
  }
  
  async getUserDoc(uid) {
    await this.afs.collection('users').get(uid);
  }
  
  getUserDetails(uid: String) {
    return this.afs.firestore.collection('users').doc(`${uid}`).get();
  }
  
  async setIsDonor(uid: String, data) {
    await this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }

  async setDietaryRestrictions(uid: String, data) {
    await this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }

  async setChildProfile(uid: String, data) {
    await this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }
}
