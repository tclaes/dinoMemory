import { Inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, User as FirebaseUser } from '@angular/fire/auth';
import { User } from './userprofile/register/register.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AUTH_OPS, AuthOps } from './auth-ops';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: Observable<FirebaseUser>;
  user: FirebaseUser = null;

  constructor(
    private auth: Auth,
    @Inject(AUTH_OPS) private ops: AuthOps,
    private router: Router
    ) {
    this.authState = this.ops.authState(this.auth);
    this.authState
    .subscribe(user => this.user = user);
  }

  get User() {
    return this.authState;
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.ops
        .signInWithPopup(this.auth, provider)
        .then(res => {
          this.user = res.user;
          this.router.navigate(['/']);
          resolve(res);
        });
    });
  }

  doEmailLogin(user) {
    this.ops
      .signInWithEmailAndPassword(this.auth, user.name, user.email)
      .then(res => {
        this.user = res.user;
        this.updateUserInfo();
      });
  }

  tryRegister(user: User) {
    this.ops
      .createUserWithEmailAndPassword(this.auth, user.email, user.password)
      .then(userCredential => {
        this.ops.updateProfile(userCredential.user, {
          displayName: user.name,
          photoURL: ''
        });
        console.log(userCredential.user.displayName);
        this.user = userCredential.user;
      })
      .catch(err => console.log('Something went wrong', err.message)
      );
  }

  updateUserInfo() {
    console.log(`Username: ${this.user.displayName}`);
    this.ops
      .updateCurrentUser(this.auth, this.user);
  }

  logOut() {
    this.ops.signOut(this.auth)
      .then(() => {
        this.router.navigate(['/']);
      });
  }

}
