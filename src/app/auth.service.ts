import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from './userprofile/register/register.component';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.authState = afAuth.authState;
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        });
    });
  }

  tryRegister(user: User) {
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(value => console.log('Success!', value))
      .catch(err => console.log('Something went wrong', err.message)
      );
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

}
