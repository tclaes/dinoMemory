import {Component} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-user',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
  imports: [
    MatCard,
    MatGridList,
    MatGridTile,
    MatFormField,
    MatInput,
    MatButton
  ]
})
export class UserprofileComponent {

  // user: User;
  //
  // constructor(private authService: AuthService) {
  //   authService.User.subscribe(user => this.user = user);
  // }

}
