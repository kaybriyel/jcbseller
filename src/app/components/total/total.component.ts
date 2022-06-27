import { Component, OnInit } from '@angular/core';
import { IonModal, NavController } from '@ionic/angular';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss'],
})
export class TotalComponent implements OnInit {

  note: any
  modal: IonModal
  constructor(
  ) { }

  ngOnInit() {
    this.note = {}
    this.loadData()
  }

  async loadData() {
    
  }

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }
}
