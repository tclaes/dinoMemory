import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FIRESTORE_OPS, FirestoreOps } from './firestore-ops';

export interface Score {
  user: string;
  deck: string;
  clicks: number;
  /** Game time in milliseconds. */
  durationMs: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  collection$: Observable<Score[]>;

  private firestore = inject(Firestore);
  private ops: FirestoreOps = inject(FIRESTORE_OPS);

  loadScores(deck) {
    const scoresRef = this.ops.collection(this.firestore, 'scores');
    const q = this.ops.query(
      scoresRef,
      this.ops.where('deck', '==', deck),
      this.ops.orderBy('clicks'),
      this.ops.orderBy('durationMs'),
      this.ops.startAt(0),
      this.ops.endAt(100),
      this.ops.limit(10)
    );
    this.collection$ = this.ops.collectionData(q) as Observable<Score[]>;
    return this.collection$;
  }

  updateScores(user: string, clicks: number, durationMs: number, deck: string) {
    this.loadScores(deck);
    const data = {
      user: user,
      deck: deck,
      clicks: clicks,
      durationMs: durationMs
    };

    this.ops.addDoc(this.ops.collection(this.firestore, 'scores'), data);

  }
}
