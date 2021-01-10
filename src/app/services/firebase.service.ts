import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'
import { Observable } from 'rxjs';
import { SalesGoal } from '../model/metaDeVenta'
import { testState } from './initialBdState'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  saleGoals:string = "saleGoals"

  constructor(private bd:AngularFirestore) { }

  async resetDB(){
    let res = await this.bd.collection(this.saleGoals).get().toPromise()
    res.forEach( doc => {
      this.bd.doc("/"+this.saleGoals+"/"+doc.id).delete().catch(err => {
        return err
      })
    })
  }

  async setTestState(){
    for (const goal of testState) {
      this.bd.collection(this.saleGoals).add(goal)
    }
  }

  async getGoals():Promise<SalesGoal[]>{
    let retVal:SalesGoal[] = []
    let res = await this.bd.collection(this.saleGoals).get().toPromise()
    res.forEach(doc => {
      retVal.push(doc.data() as SalesGoal)
    })
    return retVal
  }

  getGoalsSubscription():Observable<SalesGoal[]>{
    return new Observable(sus => {
      this.bd.collection(this.saleGoals).snapshotChanges().subscribe(res => {
        let retVal = []
        res.forEach(doc => {
          retVal.push(doc.payload.doc.data() as SalesGoal)
        })
        sus.next(retVal)
      })
    })
  }

}
