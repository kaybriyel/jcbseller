import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController, ModalOptions, NavController } from '@ionic/angular';
import { OrderCake, OrdercakeComponent } from 'src/app/components/ordercake/ordercake.component';
import { TotalComponent } from 'src/app/components/total/total.component';
import { ApiService, APP_API_PATH } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { Cake } from '../cakes/cakes.page';


interface CakeData {
  price_list?: number[]
  all?: Cake[]
  group_by_price?: {}
}

interface OrderCakeData {
  price_list?: number[]
  all?: OrderCake[]
  group_by_price?: {}
}

class ResponseData {
  orders: OrderCakeData
  cakes: CakeData

  constructor() {
    this.orders = {}
    this.cakes = {}
  }

  fromJson(data) {
    this.orders = data.orders
    this.cakes = data.cakes

    this.orders.all = this.orders.all.map(oc => {
      const _oc = new OrderCake
      _oc.from(oc)
      return _oc
    })

    for(const price in this.orders.group_by_price) {
      this.orders.group_by_price[price] = this.orders.group_by_price[price].map(oc => {
        const _oc = new OrderCake
        _oc.from(oc)
        return _oc
      })
    }
  }
}

interface OrderNote {
  id?: number
  status?: string
  actual_amount?: number
  order_cake_ids?: number[]
  week_day?: string
  qty_order?: number
  qty_remain?: number
  qty_sold?: number
  amount_sold?:number
}

@Component({
  selector: 'app-orderform',
  templateUrl: './orderform.page.html',
  styleUrls: ['./orderform.page.scss'],
})
export class OrderformPage implements OnInit {
@ViewChild('searchBar', { read: IonSearchbar }) searchBar: IonSearchbar

  data: ResponseData
  displayCakeData: CakeData
  displayOrderData: OrderCakeData
  selectedPrice: number | string
  selectedData: number | string
  
  note: OrderNote
  searchValue: string
  searchEnable: boolean
  searchTimeout: any
  htmlModal: any;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private modalCtrl: ModalController,
    private storage: StorageService
    ) { }

  ngOnInit() {
    this.data = new ResponseData
    this.displayCakeData = {}
    this.displayOrderData = {}
    this.searchValue = ''
    this.selectedPrice = 'all'
    this.selectedData = 'orders'
    this.note = {}
  }

  ionViewDidEnter() {
    this.loadData()
  }
  
  async loadData() {
    this.note = await this.storage.getSession('note')
    const res = await this.api.get(APP_API_PATH + `data?for_page=orderform&order_cake_note_id=${this.note.id}`)
    const { data } = await res.json()
    this.data.fromJson(data)
    this.displayCakeData = {...this.data.cakes}
    this.displayOrderData = {...this.data.orders}
    this.selectPrice(this.selectedPrice)
  }

  async presentModal(opt: ModalOptions) {
    if(this.htmlModal && this.htmlModal.isConnected) return {}
    this.htmlModal = await this.modalCtrl.create({...opt, canDismiss: false})
    this.htmlModal.present()
    return this.htmlModal.onWillDismiss()
  }

  back() {
    this.navCtrl.navigateBack('/tabs/forms')
  }

  priceSegmentChanged(ev) {
    this.selectPrice(ev.detail.value)
  }

  dataSegmentChanged(e) {
    this.selectedData = e.detail.value
  }

  selectPrice(price) {
    this.selectedPrice = price
    if (isNaN(price)) {
      this.displayCakeData.price_list = this.data.cakes.price_list
      this.displayOrderData.price_list = this.data.orders.price_list
    }
    else {
      this.displayCakeData.price_list = [this.selectedPrice as number]
      this.displayOrderData.price_list = [this.selectedPrice as number]
    }
  }

  scrollIntoView(ev) {
    ev.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  async cakeClick(ev, cake) {
    const oc = new OrderCake(cake)
    oc.order_cake_note_id = this.note.id
    await this.storage.saveSession('ordercake-modal', oc)
    const { data } = await this.presentModal({ component: OrdercakeComponent })
    if(data) {
      // remove from group_by_price
      let idx = this.data.cakes.group_by_price[cake.riel_price].findIndex(c => c.id == cake.id)
      if(idx >= 0)
        this.data.cakes.group_by_price[cake.riel_price].splice(idx, 1)
      // remove from all
      idx = this.data.cakes.all.findIndex(c => c.id == cake.id)
      this.data.cakes.all.splice(idx, 1)
      

      this.data.orders.all.push(data)
      if(!this.data.orders.group_by_price[data.price_sale])
        this.data.orders.group_by_price[data.price_sale] = [data]
      else this.data.orders.group_by_price[data.price_sale].push(data)

      if(!this.data.orders.price_list.includes(data.price_sale)) {
        this.data.orders.price_list.push(data.price_sale)
        this.data.orders.price_list = this.data.orders.price_list.sort((a, b) => a - b)
      }
    }
  }

  cakeFilter(list) {
    return list.filter(d => d.name.replace(/ /g, '').toLowerCase().includes(this.searchValue.toLowerCase().replace(/ /g, '')))
  }

  ordercakeFilter(list) {
    return list.filter(d => d.cake.name.replace(/ /g, '').toLowerCase().includes(this.searchValue.toLowerCase().replace(/ /g, '')))
  }

  async ordercakeClick(ev, ordercake) {
    await this.storage.saveSession('ordercake-modal', ordercake)
    const { data } = await this.presentModal({ component: OrdercakeComponent })
    if(data) {
      let idx = this.data.orders.all.findIndex(oc => oc.cake_id == ordercake.cake_id)
      if(idx > -1) this.data.orders.all[idx].from(data)

      idx = this.data.orders.group_by_price[ordercake.price_sale].findIndex(oc => oc.cake_id == ordercake.cake_id)
      if(idx > -1) this.data.orders.group_by_price[ordercake.price_sale][idx].from(data)

      this.updateTotal()
    }
  }

  get displayPriceList() {
    if(this.selectedData === 'orders') return this.data.orders.price_list
    else if(this.selectedData === 'cakes') return this.data.cakes.price_list
  }

  removeOrdercake(ordercake) {

    this.api.delete(`order-cakes/${ordercake.id}`)

    this.data.cakes.all.push(ordercake.cake)
    if(!this.data.cakes.group_by_price[ordercake.price_sale]) this.data.cakes.group_by_price[ordercake.price_sale] = [ordercake.cake]
    else this.data.cakes.group_by_price[ordercake.price_sale].push(ordercake.cake)

    if(!this.data.cakes.price_list.includes(ordercake.price_sale)) {
      this.data.cakes.price_list.push(ordercake.price_sale)
      this.data.cakes.price_list = this.data.cakes.price_list.sort((a, b) => a - b)
    }
    
    let idx = this.data.orders.all.findIndex(oc => oc.cake_id == ordercake.cake_id)
    if(idx > -1) this.data.orders.all.splice(idx, 1)

    idx = this.data.orders.group_by_price[ordercake.price_sale].findIndex(oc => oc.cake_id == ordercake.cake_id)
    if(idx > -1) this.data.orders.group_by_price[ordercake.price_sale].splice(idx, 1)

    this.updateTotal()
  }

  openTotal() {
    this.presentModal({
      component: TotalComponent
    })
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
    clearTimeout(this.searchTimeout)
    if(this.searchEnable) {
      this.searchTimeout = setTimeout(() => this.searchBar.setFocus(), 300)
    } else this.searchValue = ''
  }

  async updateTotal() {
    const res = await this.api.get(`order-cake-notes/${this.note.id}?except=order_cakes`)
    if(res.ok)
      this.note = await res.json()
  }
}
