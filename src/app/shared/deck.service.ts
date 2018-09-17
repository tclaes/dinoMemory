import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Deck {
  name: string;
  imgUrl: string;
  frontFace: string;
  cards: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(private http: HttpClient) { }

  decksUrl = '../../assets/data.json';

  getData() {
    return this.http
      .get(this.decksUrl)
      .toPromise();
  }

  setDeck(e) {
   return this.getData().then(data =>
      data['deck'].filter(x => x.name === e)
    );
  }

}
