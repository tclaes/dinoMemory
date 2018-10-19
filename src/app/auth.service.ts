import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from './userprofile/register/register.component';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) { 
    this.user = firebaseAuth.authState;
  }

  tryRegister(user: User) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(value => console.log('Success!', value))
      .catch(err => console.log('Something went wrong', err.message)
      );
  }

}
