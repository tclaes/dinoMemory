import { InjectionToken } from '@angular/core';
import {
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  limit,
  collectionData,
  addDoc
} from '@angular/fire/firestore';

/**
 * Same rationale as auth-ops.ts: the modular Firestore SDK's query builders are
 * free functions, not methods on the injected Firestore instance, so they're
 * wrapped behind an injectable token that specs can swap out with spies.
 */
export interface FirestoreOps {
  collection: typeof collection;
  query: typeof query;
  where: typeof where;
  orderBy: typeof orderBy;
  startAt: typeof startAt;
  endAt: typeof endAt;
  limit: typeof limit;
  collectionData: typeof collectionData;
  addDoc: typeof addDoc;
}

export const FIRESTORE_OPS = new InjectionToken<FirestoreOps>('FIRESTORE_OPS', {
  providedIn: 'root',
  factory: () => ({
    collection,
    query,
    where,
    orderBy,
    startAt,
    endAt,
    limit,
    collectionData,
    addDoc
  })
});
