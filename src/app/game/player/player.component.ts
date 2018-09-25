import { Component, OnInit } from '@angular/core';
import { LocalstorageService, Player } from './../../shared/localstorage.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {

  playerIsSet = false;
  player: Player;

  constructor(private local: LocalstorageService) {
    if (this.local.getUser() !== null) {
      this.playerIsSet = true;
      this.player = this.local.getUser();
    }
   }

  setPlayer(player) {
    this.player = player;
    this.playerIsSet = true;
    this.local.setUser(player);
  }

}
