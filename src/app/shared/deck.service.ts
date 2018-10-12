import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map, switchMap } from 'rxjs/operators';

export interface Deck {
  name: string;
  imgUrl?: string;
  frontFace?: string;
  cards?: string[];
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

  async setDeck(e) {
    const data = await this.getData();
    return data['deck'].filter(x => x.name === e);
  }

  getDataObservable() {
    return this.http
      .get(this.decksUrl);
  }

  setDeckObservable(e) {
    const data = this.getDataObservable();
    // console.log(data);
    return data.pipe(
      switchMap(x => x['deck']),
      filter(x => x['name'] === e)
    );
  }




}
