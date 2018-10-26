import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Player } from './player/player.component';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent {

  player: firebase.User;

  constructor(private authService: AuthService) {
    this.player = authService.Player;
  }
}
