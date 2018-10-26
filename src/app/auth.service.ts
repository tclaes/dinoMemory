import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from './userprofile/register/register.component';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { SharedService } from './shared/shared.service';
import { Player } from './userprofile/player/player.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState: Observable<firebase.User>;
  player: Player;
  user: firebase.User;

  constructor(private afAuth: AngularFireAuth, private router: Router,
      private sharedService: SharedService
    ) {
    sharedService.currentPlayer.subscribe(player => this.player = player);
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
          this.user = res.user;
          this.player.name = res.user.displayName;
          this.player.id = res.user.uid;
          this.sharedService.setPlayer(this.player);
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



  get Player() {
    return this.user;
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

}
