import {TestBed} from '@angular/core/testing';
import {Firestore} from '@angular/fire/firestore';

import {ScoreService} from './score.service';
import {FIRESTORE_OPS} from './firestore-ops';
import {createMockFirestoreOps} from '../../../testing/firebase-mocks';
import {SpyObj} from '../../../testing/spy';
import {beforeEach, describe, it} from 'vitest';

describe('ScoreService', () => {
  let service: ScoreService;
  let opsSpy: SpyObj<any>;
  const fakeFirestore = {};

  beforeEach(() => {
    opsSpy = createMockFirestoreOps([{ user: 'Rex', deck: 'dinos', clicks: 8, time: '0h - 0m - 30s' }]);
    opsSpy.collection.mockReturnValue('scores-ref');
    opsSpy.query.mockReturnValue('scores-query');
    opsSpy.where.mockReturnValue('where-constraint');
    opsSpy.orderBy.mockReturnValue('orderBy-constraint');
    opsSpy.startAt.mockReturnValue('startAt-constraint');
    opsSpy.endAt.mockReturnValue('endAt-constraint');
    opsSpy.limit.mockReturnValue('limit-constraint');

    TestBed.configureTestingModule({
      providers: [
        ScoreService,
        { provide: Firestore, useValue: fakeFirestore },
        { provide: FIRESTORE_OPS, useValue: opsSpy }
      ]
    });
    service = TestBed.inject(ScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadScores() queries the scores collection and returns its value stream', () => {
    let result: any[];
    service.loadScores('dinos').subscribe(scores => result = scores);

    expect(opsSpy.collection).toHaveBeenCalledWith(fakeFirestore, 'scores');
    expect(opsSpy.where).toHaveBeenCalledWith('deck', '==', 'dinos');
    expect(opsSpy.orderBy).toHaveBeenCalledWith('clicks');
    expect(opsSpy.orderBy).toHaveBeenCalledWith('time');
    expect(result).toEqual([{ user: 'Rex', deck: 'dinos', clicks: 8, time: '0h - 0m - 30s' }]);
  });

  it('updateScores() reloads the collection and adds a new game-status-bar with the right shape', () => {
    service.updateScores('Rex', 12, '0h - 0m - 45s', 'dinos');

    expect(opsSpy.addDoc).toHaveBeenCalledWith('scores-ref', {
      user: 'Rex',
      deck: 'dinos',
      clicks: 12,
      time: '0h - 0m - 45s'
    });
  });
});
