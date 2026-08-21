import { Inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FIRESTORE_OPS, FirestoreOps } from './firestore-ops';

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

  constructor(
    private firestore: Firestore,
    @Inject(FIRESTORE_OPS) private ops: FirestoreOps
  ) {

  }

  loadScores(deck) {
    const scoresRef = this.ops.collection(this.firestore, 'scores');
    const q = this.ops.query(
      scoresRef,
      this.ops.where('deck', '==', deck),
      this.ops.orderBy('clicks'),
      this.ops.orderBy('time'),
      this.ops.startAt(0),
      this.ops.endAt(100),
      this.ops.limit(10)
    );
    this.collection$ = this.ops.collectionData(q) as Observable<Score[]>;
    return this.collection$;
  }

  updateScores(user, clicks, time, deck) {
    this.loadScores(deck);
    const data = {
      user: user,
      deck: deck,
      clicks: clicks,
      time: time
    };

    this.ops.addDoc(this.ops.collection(this.firestore, 'scores'), data);

  }
}
