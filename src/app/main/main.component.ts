import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service'
import { SalesGoal } from '../model/metaDeVenta'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  retrievedGoals:SalesGoal[] = []

  constructor(private fire:FirebaseService) { }

  ngOnInit(): void {
    this.fire.getGoalsSubscription().subscribe(res => {
      this.retrievedGoals = res;
    })
    // this.fire.getGoals().then(res => {
    //   this.retrievedGoals = res
    // })
  }

  async setTestState(){
    await this.fire.resetDB()
    await this.fire.setTestState()
  }

  async deleteEverything() {
    await this.fire.resetDB()
  }

}
