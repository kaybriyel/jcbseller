import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthenticationService,
    private platform: Platform,
    private router: Router
    ) {
    this.initializeApp()
  }

  initializeApp() {
    const { pathname } = location
    if(!pathname.endsWith('login')) {
      sessionStorage.setItem('nextUrl', pathname)
    }
    this.platform.ready().then(() => {
      this.authService.authState.subscribe(state => {
        if(state && sessionStorage.nextUrl) {
          this.router.navigate([sessionStorage.nextUrl])
          sessionStorage.removeItem('nextUrl')
        } else if(state) this.router.navigate(['/'])
        if(!state) this.router.navigate(['login'])
      })
    })
  }
}
