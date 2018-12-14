import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  loadUserStats(userId: string) {
    this.scores = this.afs.collection('scores', ref =>
      ref.where('userId', '==', userId));
      this.collection$ = this.scores.valueChanges();
      return this.collection$;
  }

  loadScores(deck) {
    this.scores = this.afs.collection('scores', ref =>
      ref.where('deck', '==', deck).orderBy('clicks').orderBy('time').startAt(0).endAt(100).limit(10));
    this.collection$ = this.scores.valueChanges();
    return this.collection$;
  }

  updateScores(userId, user, clicks, time, deck) {
    this.loadScores(deck);
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    console.log(date);
    const data = {
      userId: userId,
      user: user,
      deck: deck,
      clicks: clicks,
      time: time,
      date: date
    };

    this.scores.add(data);

  }
}
