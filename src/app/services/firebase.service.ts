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

  constructor(public bd:AngularFirestore) { }

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
      goal.id = this.bd.createId();
      this.bd.collection(this.saleGoals).doc(goal.id).set(goal)
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
      
      this.bd.collection(this.saleGoals, q => q.orderBy("salesMan","desc").orderBy("month")).snapshotChanges().subscribe(res => {
        let retVal = []
        res.forEach(doc => {
          retVal.push(doc.payload.doc.data() as SalesGoal)
        })
        sus.next(retVal)
      })
    })
  }

  addGoal(goal:SalesGoal){
    goal.id = this.bd.createId();
    this.bd.collection(this.saleGoals).doc(goal.id).set(goal)
  }

}
