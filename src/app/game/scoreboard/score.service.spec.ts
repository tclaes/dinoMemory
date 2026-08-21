import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { ScoreService } from './score.service';
import { createMockAngularFirestore } from '../../../testing/firebase-mocks';

describe('ScoreService', () => {
  let service: ScoreService;
  let afsSpy: jasmine.SpyObj<AngularFirestore>;
  let collectionSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    const mocks = createMockAngularFirestore([{ user: 'Rex', deck: 'dinos', clicks: 8, time: '0h - 0m - 30s' }]);
    afsSpy = mocks.afsSpy;
    collectionSpy = mocks.collectionSpy;

    TestBed.configureTestingModule({
      providers: [
        ScoreService,
        { provide: AngularFirestore, useValue: afsSpy }
      ]
    });
    service = TestBed.get(ScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loadScores() queries the scores collection and returns its value stream', () => {
    let result: any[];
    service.loadScores('dinos').subscribe(scores => result = scores);

    expect(afsSpy.collection as jasmine.Spy).toHaveBeenCalledWith('scores', jasmine.any(Function));
    expect(result).toEqual([{ user: 'Rex', deck: 'dinos', clicks: 8, time: '0h - 0m - 30s' }]);
  });

  it('updateScores() reloads the collection and adds a new score with the right shape', () => {
    service.updateScores('Rex', 12, '0h - 0m - 45s', 'dinos');

    expect(collectionSpy.add).toHaveBeenCalledWith({
      user: 'Rex',
      deck: 'dinos',
      clicks: 12,
      time: '0h - 0m - 45s'
    });
  });
});
