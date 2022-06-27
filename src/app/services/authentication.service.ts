import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private platform: Platform,
    public toastController: ToastController,
    private storage: StorageService,
    private apiService: ApiService
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn()
    })
  }

  ifLoggedIn() {
    const data = this.storage.getLocal('USER_INFO')
    if (data && data.token) {
      this.apiService.token = data.token
      this.authState.next(true);
    }
  }

  async login(credential) {
    const res = await this.apiService.post('seller_app/login', {
      body: credential
    })
    const { data, message } = await res.json()
    if(res.ok) {
      const userInfo = data
      this.storage.saveLocal('USER_INFO', userInfo)
      this.ifLoggedIn()
    } else {
      (await this.toastController.create({ message })).present()
    }
  }

  async logout() {
    const res = await this.apiService.post('seller_app/logout')
    const { message } = await res.json()
    if(res.ok) {
      this.storage.removeLocal('USER_INFO')
      this.router.navigate(['login']);
      this.authState.next(false);
    } else {
      (await this.toastController.create({ message, duration: 2000 })).present()
    }
  }

  get isAuthenticated() {
    return this.authState.value;
  }

  get token() {
    return this.storage.getLocal('USER_INFO')?.token
  }
}
