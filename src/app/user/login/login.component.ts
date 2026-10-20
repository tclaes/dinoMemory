import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../core/auth/services/auth.service';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ReactiveFormsModule, RouterLink]
})
export class LoginComponent {

  signInForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
  });


  get f() {
 return this.signInForm.controls; 
}

  constructor(private auth: AuthService, private router: Router) { }

  async signInWithEmail() {
    const player = {
      email: this.signInForm.controls.email.value,
      password: this.signInForm.controls.password.value
    };
    try {
      await this.auth.doEmailLogin(player);
      this.gotoUser();
    } catch {
      // Login failed; stay on the sign-in page so the user can retry.
    }
  }

  async loginWithGoogle(e) {
    try {
      // doGoogleLogin() navigates to '/' itself once the popup resolves.
      await this.auth.doGoogleLogin();
    } catch {
      // Login failed (or the popup was dismissed); stay on the sign-in page.
    }
  }

  gotoUser() {
    this.router.navigate(['/userprofile']);
  }

}
