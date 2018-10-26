import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from './userprofile/register/register.component';
import { Observable} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: Observable<firebase.User>;
  user: firebase.User = null;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
    ) {
    this.authState = afAuth.authState;
    afAuth.authState
    .subscribe(user => this.user = user);
  }

  get User() {
    return this.authState;
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          this.user = res.user;
          this.router.navigate(['/']);
          resolve(res);
        });
    });
  }

  doEmailLogin(user) {
    this.afAuth.auth
      .signInWithEmailAndPassword(user.name, user.email)
      .then(res => {
        this.user.displayName = user.name;
        this.user = res.user;
        this.updateUserInfo();
      });
  }

  tryRegister(user: User) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        userCredential.user.updateProfile({
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
    this.afAuth.auth
      .updateCurrentUser(this.user);
  }

  logOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
  }

}
