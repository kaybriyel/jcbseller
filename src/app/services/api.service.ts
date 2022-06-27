import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const APP_API_PATH = 'seller_app/'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {}

  private _token: string
  // private apiUrl = 'https://jcbakery.herokuapp.com/api/'
  private apiUrl = 'http://192.168.0.102:8000/api/'

  set token(token: string) {
    this._token = token
  }

  private headers() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ this._token }`
    }
  }

  get(path: string, opt: RequestInit = {}) {
    opt.headers = { ...this.headers(), ...opt.headers }
    opt.method = 'GET'
    if(path.startsWith('http')) throw new Error('Must not start with http')
    return fetch(this.apiUrl + path, opt)
  }
  
  post(path: string, opt: RequestInit = {}) {
    opt.headers = { ...this.headers(), ...opt.headers },
    opt.method = 'POST'
    opt.body = JSON.stringify(opt.body)
    if(path.startsWith('http')) throw new Error('Must not start with http')
    return fetch(this.apiUrl + path, opt)
  }

  put() {

  }

  delete(path: string) {
    if(path.startsWith('http')) throw new Error('Must not start with http')
    return fetch(this.apiUrl + path, { headers: {...this.headers()}, method: 'DELETE' })
  }
}
