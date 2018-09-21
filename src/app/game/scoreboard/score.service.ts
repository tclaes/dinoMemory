import { Injectable, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Score {
  user: string;
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
    this.scores = this.afs.collection('scores', ref => ref.orderBy('time'));
    this.collection$ = this.scores.valueChanges();
  }

  loadScores() {
    return this.collection$;
  }

  updateScores(user, clicks, time) {
    console.log(clicks);
    const data = {
      user: 'Tom',
      clicks: clicks,
      time: time
    };

    this.scores.add(data);

  }
}
