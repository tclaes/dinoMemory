import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {

  playerIsSet;

  constructor(public localStorage: LocalstorageService) { }

  setPlayer(player) {
    this.localStorage.setUser(player);
  }

}
