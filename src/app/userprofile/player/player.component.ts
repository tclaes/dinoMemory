import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from './../../shared/localstorage.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from './../../shared/shared.service';

export interface Player {
  name: string;
  set: boolean;
  id?: string;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})

export class PlayerComponent implements OnInit {

  myForm: FormGroup;
  player: Player;

  constructor(private local: LocalstorageService, private fb: FormBuilder, private sharedService: SharedService) {
    if (this.local.getUser() !== null) {
      this.sharedService.setPlayer({name: this.local.getUser(), set: true});
    }
    this.sharedService.currentPlayer.subscribe(player => this.player = player);
   }

  setPlayer() {
    this.myForm = this.fb.group({name: ''});
    this.player.set = true;
    this.sharedService.setPlayer(this.player);
    console.log(this.player);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ''
    });
    this.formChanges();
  }

  formChanges() {
    this.myForm.valueChanges.subscribe(name => {
      console.log(this.player.name);
      this.player = ({name: name, set: false});
    });
  }
}
