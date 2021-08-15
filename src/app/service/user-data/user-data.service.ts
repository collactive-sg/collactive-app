import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from "@angular/fire/firestore"; 
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  constructor(
  private afs: AngularFirestore,
  private afStorage: AngularFireStorage,
  ) { }
  
  baseProfileImagesPath = "userProfileImages"
  
  getProfileImg(uid: any) {
    return this.afStorage.ref(`${this.baseProfileImagesPath}/${uid}`).getDownloadURL();
  }

  getUserDoc(uid) {
    return this.afs.doc(`users/${uid}`).valueChanges();
  }

  updateUserDoc(uid, data) {
    this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }
  
  async uploadProfileImg(uid: String, file: any) {
    let storageRef = this.afStorage.storage.ref();
    return await storageRef.child(`${this.baseProfileImagesPath}/${uid}`).put(file);
  }
}
