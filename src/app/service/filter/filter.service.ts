import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private afs: AngularFirestore,
  ) { }

  addFilterListings(userId:string, isDateExpressedSortSelected:boolean, 
    isDatePostedSortSelected:boolean, milkType:string, donorDiet, 
    isOnHealthSupplements, donorBabyAge) {
    return this.afs.collection(`filter`).doc(userId).set({
      userId: userId,
      isDateExpressedSortSelected: isDateExpressedSortSelected,
      isDatePostedSortSelected: isDatePostedSortSelected,
      milkType: milkType,
      donorDiet: donorDiet,
      isOnHealthSupplements: isOnHealthSupplements,
      donorBabyAge: donorBabyAge,
    }, {merge: true});
  }

  getFilter(userId) {
    return this.afs.collection('filter').doc(userId).get();
  }

}
