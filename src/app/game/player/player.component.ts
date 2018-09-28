import { Component, OnInit } from '@angular/core';
import { LocalstorageService, Player } from './../../shared/localstorage.service';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {

  myForm: FormGroup;

  playerIsSet = false;
  player: Player;

  constructor(private local: LocalstorageService, private fb: FormBuilder) {
    if (this.local.getUser() !== null) {
      this.playerIsSet = true;
      this.player = this.local.getUser();
    }
   }

  setPlayer() {
    this.playerIsSet = true;
    this.local.setUser(this.player.name);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ''
    });
    this.myForm.valueChanges.subscribe(name => {
      this.player = name;
    });
  }

}
