import { Injectable, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { GameService } from '../game.service';

export interface Score {
  user: string;
  deck: string;
  clicks: number;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  collection$: Observable<Score[]>;
  scores: AngularFirestoreCollection<Score>;

  constructor(private afs: AngularFirestore) {

  }

  loadScores(deck) {
    this.scores = this.afs.collection('scores', ref =>
      ref.where('deck', '==', deck.id).orderBy('clicks').orderBy('time').startAt(0).endAt(100));
    console.log(this.scores);
    this.collection$ = this.scores.valueChanges();
    return this.collection$;
  }

  updateScores(user, clicks, time, deck) {
    this.loadScores(deck);
    const data = {
      user: 'Guest',
      deck: deck.id,
      clicks: clicks,
      time: time
    };

    this.scores.add(data);

  }
}
