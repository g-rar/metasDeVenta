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
  addingGoal:boolean = false
  addingGoalFields:SalesGoal;
  editingGoal:number = -1
  editingGoalFields:SalesGoal;

  constructor(private fire:FirebaseService) { }

  ngOnInit(): void {
    this.fire.getGoalsSubscription().subscribe(res => {
      this.retrievedGoals = res;
    })
  }

  async setTestState(){
    await this.fire.resetDB()
    await this.fire.setTestState()
  }

  async deleteEverything() {
    await this.fire.resetDB()
  }

  async editGoal(id:string, index:number){
    this.editingGoal = index
    this.editingGoalFields = {...this.retrievedGoals[index]}
  }

  confirmEdit(){
    if(confirm("¿Está seguro de que quiere realizar esos cambios?")){
      this.fire.bd.collection(this.fire.saleGoals).doc(this.editingGoalFields.id).set(this.editingGoalFields)
      .then(() => {
        alert("Se han realizado las modificaciones.")
      })
      .catch(() => {
        alert('Hubo un error, se desharan los cambios realizados.')
      })
      .finally(() => {
        this.cancelEdit()
      })
    }
  }

  cancelEdit(){
    this.editingGoalFields = null;
    this.editingGoal = -1;
  }

  async deleteGoal(id:string){
    if(confirm("¿Esta seguro de que quiere borrar esta meta de venta?")){
      this.fire.bd.collection(this.fire.saleGoals).doc(id).delete()
      .then(() => {
        alert("Se ha borrado la meta de venta exitosamente... No se pudo cumplir la meta :c")
      })
    }
  }

  async addGoal(){
    this.addingGoal = true
    let d = new Date();
    this.addingGoalFields = {
      year: d.getFullYear(),
      month: d.getMonth() +1,
      salesMan: 1,
      brand: 1,
      amount: 1
    }
  }

  async confirmAddGoal(){
    this.fire.addGoal(this.addingGoalFields)
    this.cancelAddGoal()
  }

  async cancelAddGoal(){
    this.addingGoal = false
    this.addingGoalFields = undefined
  }

}
