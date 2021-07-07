import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore"; 

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(
    private afs: AngularFirestore
  ) {

   }

   async getUserDoc(uid) {
    await this.afs.collection('users').get(uid);
   }

}
