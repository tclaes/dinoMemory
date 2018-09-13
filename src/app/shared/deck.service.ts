import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameComponent } from '../game/game.component';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(private http: HttpClient) { }

  decksUrl = '../../assets/data.json';

  getData() {
    return this.http.get(this.decksUrl).toPromise();
  }

  setDeck(e) {
   return this.getData().then(data =>
      data['deck'].filter(x => x.name === e.target.id)
    );
  }

}
