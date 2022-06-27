import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.scss'],
})
export class TotalComponent implements OnInit {

  note: any

  constructor() { }

  ngOnInit() {
    this.note = {}
    this.loadData()
  }

  async loadData() {
    
  }
}
