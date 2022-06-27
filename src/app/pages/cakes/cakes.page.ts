import { Component, OnInit } from '@angular/core';
import { ApiService, APP_API_PATH } from 'src/app/services/api.service';

interface ResponseData {
  all?: any[]
  price_list?: number[]
  group_by_price?: any[]
}

export class Cake {
  id: number
  name: string
  img: string
  riel_price: number
}

@Component({
  selector: 'app-cakes',
  templateUrl: './cakes.page.html',
  styleUrls: ['./cakes.page.scss'],
})
export class CakesPage implements OnInit {

  data: ResponseData
  displayData: ResponseData
  selectedPrice: number | string
  selectList: Set<any>

  searchValue:string
  searchEnable: boolean = false

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.data = {}
    this.displayData = {}
    this.selectList = new Set
    this.searchValue = ''
    this.selectedPrice = 'all'
  }

  ionViewDidEnter() {
    this.getData()
  }

  async getData() {
    const res = await this.api.get(APP_API_PATH + 'data?for_page=cakes')
    const { message, data } = await res.json()
    this.data = data
    console.log(message, data)
    this.selectPrice(this.selectedPrice)
  }

  segmentChanged(ev) {
    this.selectPrice(ev.detail.value)
  }

  selectPrice(price) {
    this.selectedPrice = price
    if (isNaN(price)) {
      this.displayData.price_list = this.data.price_list
    }
    else this.displayData.price_list = [this.selectedPrice as number]
  }

  cakeClick(ev, id) {
    // select cake
    if(ev.target.tagName === 'IMG' || ev.target.tagName === 'ION-CHECKBOX') {
      if (!this.selectList.has(id))
        this.selectList.add(id)
      else this.selectList.delete(id)
    }
  }

  selectAll(price) {
    if (isNaN(price))
      this.data.all.forEach(({ id }) => this.selectList.add(id))
    else this.data.group_by_price[price].forEach(({ id }) => this.selectList.add(id))
  }

  toggleSelectAll(price) {
    setTimeout(() => {
      if (this.isSelectedAll(price)) this.deSelectAll(price)
      else this.selectAll(price)
    }, 100)
  }

  deSelectAll(price) {
    if (isNaN(price))
      this.data.all.forEach(({ id }) => this.selectList.delete(id))
    else
      this.data.group_by_price[price].forEach(({ id }) => this.selectList.delete(id))
  }

  isSelectedAll(price) {
    if (isNaN(price))
      return this.data.all.every(({ id }) => this.selectList.has((id)))
    else return this.data.group_by_price[price].every(({ id }) => this.selectList.has(id))
  }

  scrollIntoView(ev) {
    ev.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  toggleSearch() {
    this.searchEnable = !this.searchEnable
  }
}
