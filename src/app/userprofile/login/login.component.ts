import { Component } from '@angular/core';
import { AuthService } from './../../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  get f() { return this.signInForm.controls; }

  constructor(private auth: AuthService, private router: Router) { }

  signInWithEmail() {
    const player = {
      email: this.signInForm.controls.email.value,
      password: this.signInForm.controls.password.value
    };
    this.auth.doEmailLogin(player);
    this.gotoUser();
  }

  loginWithGoogle(e) {
    this.auth.doGoogleLogin();
    this.gotoUser();
  }

  gotoUser() {
    this.router.navigate(['/userprofile']);
  }

}
