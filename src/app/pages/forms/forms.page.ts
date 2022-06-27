import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService, APP_API_PATH } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

interface Data {
  list_header?: string
  list?: any[]
  isOrdered?: boolean
}

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  data: Data

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private storage: StorageService
  )
    { }

  ngOnInit() {
    this.data = {}
  }

  ionViewDidEnter() {
    this.getData()
  }

  async getData() {
    const res = await this.apiService.get(APP_API_PATH + 'data?for_page=forms&except[]=order_cakes')
    const json = await res.json()
    this.data = json.data
    console.log(this.data)
  }

  async openOrderformPage(form) {
    await this.storage.saveSession('note', form)
    this.navCtrl.navigateBack('/orderform')
  }

  async delete(id) {
    const res = await this.apiService.delete(`order-cake-notes/${id}`)
    if(res.ok) {
      const idx = this.data.list.findIndex(f => f.id == id)
      if(idx >= 0) {
        this.data.list.splice(idx, 1)
        if(this.data.list.length === 0) this.data.isOrdered = false
      }
    }
  }

  async newForm() {
    const res = await this.apiService.post('order-cake-notes')
    if(res.ok) {
      const json = await res.json()
      const form = json.data
      await this.storage.saveSession('note', form)
      this.data.list.push(form)
      this.navCtrl.navigateForward('/orderform')
      this.data.isOrdered = true
    }
  }

  async submit(f, itemSliding) {
    const form = {...f}
    form.status = 'submitted'
    const res = await this.apiService.put(`order-cake-notes/${form.id}`, {
      body: form
    })
    if(res.ok) {
      f.status = form.status
      itemSliding.close()
    }
  }
}
