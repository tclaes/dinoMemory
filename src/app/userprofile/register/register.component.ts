import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from './../../auth.service';

export interface User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService) {}

  get f() { return this.registerForm.controls; }

  register() {
    const user = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };
    console.log(`RegisterComponent: ${user.email}`);

    this.authService.tryRegister(user);
  }

}
