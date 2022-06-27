import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  key(key:string) {
    return `JCBSELLER-${key}`
  }

  getLocal(key: string) {
    const data = localStorage.getItem(this.key(key))
    
    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  }

  getSession(key: string) {
    const data = sessionStorage.getItem(this.key(key))
    
    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  }

  saveLocal(key: string, value: any) {
    if(typeof value === 'object') localStorage.setItem(this.key(key), JSON.stringify(value))
    else localStorage.setItem(this.key(key), value)
  }

  saveSession(key: string, value: any) {
    if(typeof value === 'object') sessionStorage.setItem(this.key(key), JSON.stringify(value))
    else sessionStorage.setItem(this.key(key), value)
  }

  removeLocal(key: string) {
    localStorage.removeItem(this.key(key))
  }

  removeSession(key: string) {
    sessionStorage.removeItem(this.key(key))
  }
}
