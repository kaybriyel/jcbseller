import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Cake } from 'src/app/pages/cakes/cakes.page';
import { ApiService, APP_API_PATH } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

interface IOrderCake {
  order_cake_note_id: number
  cake_id: number
  qty_order: number
  qty_remain: number
}

export class OrderCake {
  id: number
  order_cake_note_id: number
  cake_id: number
  price_sale: number
  qty_order: number
  qty_remain: number
  qty_sold: number
  amount_sold: number

  cake: Cake

  constructor(cake?: Cake) {
    if(cake) {
      this.cake = cake
      this.cake_id = cake.id
      this.price_sale = cake.riel_price
    } else {
      this.cake_id = null
      this.price_sale = null
    }

    this.qty_order = null
    this.qty_remain = null
    this.qty_sold = null
    this.amount_sold = null
    
  }

  from(data: any) {
    this.id = data.id
    this.order_cake_note_id = data.order_cake_note_id
    this.cake_id = data.cake_id
    this.price_sale = data.price_sale
    this.qty_order = data.qty_order
    this.qty_remain = data.qty_remain
    this.qty_sold = data.qty_sold
    this.amount_sold = data.amount_sold
    this.cake = data.cake
  
    cake: Cake
  }

  update() {
    if(this.qty_remain > this.qty_order) this.qty_remain = this.qty_order

    if(this.qty_order == undefined || this.qty_order == null) {
      this.qty_remain = null
      this.qty_sold = null
      this.amount_sold = null
    }
    else if(this.qty_remain != undefined && this.qty_remain != null) {
      this.qty_sold = this.qty_order - this.qty_remain
      this.amount_sold = this.qty_sold * this.price_sale
    } else {
      this.qty_sold = null
      this.amount_sold = null
    }
  }
}

@Component({
  selector: 'app-ordercake',
  templateUrl: './ordercake.component.html',
  styleUrls: ['./ordercake.component.scss'],
})
export class OrdercakeComponent implements OnInit {
  @ViewChild('createSupplier', {read: ElementRef}) createSupplierBtn: ElementRef;
  
  modal: IonModal
  ordercake: OrderCake
  prev: OrderCake

  constructor(
    private storage: StorageService,
    private api: ApiService
    ) { }

  ngOnInit() {
    this.ordercake = new OrderCake
    this.prev = new OrderCake
    this.loadData()
  }

  async loadData() {
    this.ordercake.from(await this.storage.getSession('ordercake-modal'))
    this.prev.from(this.ordercake)
  }

  logScrollStart() { }

  logScrolling(e) { }

  logScrollEnd() { }

  back() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  async createSupplier() {
    this.modal.canDismiss = true
    this.modal.dismiss()
  }

  get isModified() {
    return JSON.stringify(this.prev) != JSON.stringify(this.ordercake)
  }

  get inputRemainVisible() {
    return !isNaN(this.ordercake.qty_order) && this.ordercake.qty_order > 0
  }

  get qtySoldVisible() {
    return !isNaN(this.ordercake.qty_remain) && this.ordercake.qty_remain != null
  }

  get amountSoldVisible() {
    return !isNaN(this.ordercake.amount_sold) && this.ordercake.amount_sold != null
  }

  input(ev) {
    if(ev.target.value > this.ordercake.qty_order) ev.target.value = this.ordercake.qty_order
  }

  async done() {
    const data: IOrderCake = {
      order_cake_note_id: this.ordercake.order_cake_note_id,
      cake_id: this.ordercake.cake_id,
      qty_order: this.ordercake.qty_order,
      qty_remain: this.ordercake.qty_remain
    }

    const body = {
      order_cake_note_id: this.ordercake.order_cake_note_id,
      order_cakes: [ data ]
    }

    const res = await this.api.post('order-cakes', {
      body: body as any
    })
    console.log(res.ok)
    if(res.ok) {
      this.modal.canDismiss = true
      this.modal.dismiss(this.ordercake)
    }
  }
}
