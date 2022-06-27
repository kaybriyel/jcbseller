import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credential: any

  constructor(
    private authService: AuthenticationService,
  ) {
    this.credential = {}
  }

  ngOnInit() {}

  get ok() {
    let ok = this.credential.email && this.credential.password
    if(ok) ok = (this.credential.email.length > 10) && (this.credential.password.length >= 8)
    return ok
  }

  login() {
    this.authService.login(this.credential)
  }
}
