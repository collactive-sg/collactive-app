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
    
    async getUserDoc(uid) {
      await this.afs.collection('users').get(uid);
    }
    
    async uploadProfilePhoto(uid: any, file: any) {
      let storageRef = this.afStorage.storage.ref();
      return await storageRef.child(`${this.baseProfileImagesPath}/${uid}`).put(file);
    }
  
  async setIsDonor(uid: String, data) {
    await this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }
}
