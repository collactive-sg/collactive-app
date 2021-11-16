import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore"; 
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  userDetails;
  constructor(
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
  ) { }
  
  baseProfileImagesPath = "userProfileImages"
  
  getProfileImg(uid: string) {
      if (uid !== undefined) return this.afStorage.ref(`${this.baseProfileImagesPath}/${uid}`).getDownloadURL();
  }

  getUserDoc(uid: string) {
    return this.afs.doc(`users/${uid}`).valueChanges();
  }

  updateUserDoc(uid: string, data: any) {
    this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }
  
  getUserDetails(uid: String) {
    return this.afs.firestore.collection('users').doc(`${uid}`).get();
  }

  async setIsDonor(uid: String, data) {
    await this.afs.collection('users').doc(`${uid}`).set(data, {merge: true})
  }
  
  async uploadProfileImg(uid: String, file: any) {
    let storageRef = this.afStorage.storage.ref();
    return await storageRef.child(`${this.baseProfileImagesPath}/${uid}`).put(file);
  }

  // For children collection
  addNewChildProfile(uid: String, data) {
    return this.afs.collection('users').doc(`${uid}`).collection('children').add(data).then(res => {
      this.afs.collection('users').doc(`${uid}`).collection('children').doc(res.id).set({childID:res.id} , {merge:true});
      return res.id
    })
  }

  updateChildProfile(uid: String, cid: String, data) {
    return this.afs.collection('users').doc(`${uid}`).collection('children').doc(`${cid}`).set(data, {merge: true})
  }

  getChildProfile(uid: String, cid: String) {
    return this.afs.collection('users').doc(`${uid}`).collection('children').doc(`${cid}`).get();
  }

  getChildren(uid: String) {
    return this.afs.collection('users').doc(`${uid}`).collection('children').ref.get()
  }

  deleteChildProfile(uid: String, cid: String) {
    return this.afs.collection('users').doc(`${uid}`).collection('children').doc(`${cid}`).delete();
  }

  // for user filtering
  getDonorsByDietaryRestrictions(donorPrefs, isOnHealthSupplements, isHealthSupplementsFilterChosen) {
    if (isHealthSupplementsFilterChosen) {
      donorPrefs.push({ name: "Health supplements", checked: isOnHealthSupplements });
    }
    donorPrefs = donorPrefs.filter(x => x.checked);
    if (donorPrefs.length === 0) {
      return this.afs.firestore.collection('users').get();
    }
    return this.afs.collection('users')
      .ref.where('dietary-restrictions', 'array-contains-any', donorPrefs).get();
  }

  getAllChildren() {
    return this.afs.firestore.collectionGroup('children').get();
  }

  checkIfCompleteProfile(isDonor, userDetails, childrenDetails) {
    var firstName = userDetails["firstName"];
    var lastName = userDetails["lastName"];
    var lifestyleInfo = userDetails["lifestyle-info"];
    var dietaryPreferences = userDetails["dietary-restrictions"];
    var areaOfResidency = userDetails["areaOfResidency"];
    var dateOfBirth = userDetails["dateOfBirth"];
    if (isDonor) {
      return firstName 
        && lastName 
        && areaOfResidency 
        && dateOfBirth
        && lifestyleInfo
        && dietaryPreferences
        && childrenDetails
        && childrenDetails.length > 0
        && dietaryPreferences.length > 8
        && Object.keys(lifestyleInfo).length > 2
    } else {
      return firstName 
        && lastName 
        && areaOfResidency 
        && dateOfBirth
        && childrenDetails
        && childrenDetails.length > 0
    }
  }

  // not fully tested out
  deleteUserData(userID) {
    // only delete user's listing related stuff. will keep the stuff of user as receiver
    return this.afs.collection('listings').ref.where('donorID', '==', userID).get().then((listings) => {
      listings.forEach(listing => {
        // delete chatrooms
        this.afs.collection('chatrooms').ref.where('listingID', '==', listing.id).get().then((chatrooms) => {
          chatrooms.forEach(chatroom => {
            this.afs.collection('chatrooms').doc(`${chatroom.id}`).delete();
          })
        });

        // delete notifications
        this.afs.collection('notifications').ref.where('listingID', '==', listing.id).get().then((notifications) => {
          notifications.forEach(notification => {
            this.afs.collection('notifications').doc(`${notification.id}`).delete();
          })
        });

        // delete likes
        this.afs.collection('likes').ref.where('listingID', '==', listing.id).get().then((likes) => {
          likes.forEach(like => {
            this.afs.collection('likes').doc(`${like.id}`).delete();
          })
        });

        // delete messages
        this.afs.collection('messages').ref.where('listingID', '==', listing.id).get().then((messages) => {
          messages.forEach(message => {
            this.afs.collection('messages').doc(`${message.id}`).delete();
          })
        });

        this.afs.collection('listings').doc(`${listing.id}`).delete();
        this.afs.collection('listings').doc(userID).delete();
      })
    })
  }

}
