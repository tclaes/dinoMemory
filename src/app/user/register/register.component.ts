import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth/services/auth.service';

export interface User {
  name: string;
  email: string;
  password: string;
  id?: string;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {

  registerForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService) {}

  get f() {
 return this.registerForm.controls; 
}

  register() {
    const user: User = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.tryRegister(user);
  }

}
