import {describe, expect, it} from 'vitest';
import data from '../../../../assets/data.json';
import {Deck} from './deck';

const deck = (data as { deck: Deck[] }).deck.find(d => d.name === 'alfabet');

describe('alfabet deck data', () => {
  it('is present', () => {
    expect(deck).toBeTruthy();
  });

  it('has each letter or sound at most once', () => {
    const keys = deck.pairs.map(p => p.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has a word containing the sound for every pair', () => {
    for (const pair of deck.pairs) {
      expect(pair.word, `${pair.letter} -> ${pair.word}`).toContain(pair.letter);
    }
  });

  it('has a highlight that occurs in the word when present', () => {
    for (const pair of deck.pairs.filter(p => p.highlight)) {
      expect(pair.word, pair.letter).toContain(pair.highlight);
    }
  });

  it('highlights the sound when the word does not start with it', () => {
    for (const pair of deck.pairs.filter(p => !p.word.startsWith(p.letter))) {
      expect(pair.highlight, pair.letter).toBe(pair.letter);
    }
  });

  it('covers the first-grade sounds', () => {
    const keys = deck.pairs.map(p => p.key);

    for (const sound of ['aa', 'ee', 'oo', 'uu', 'ie', 'oe', 'eu', 'ui', 'ou', 'au', 'ei', 'ij', 'sch', 'ng', 'nk']) {
      expect(keys).toContain(sound);
    }
  });

  it('starts with phase 1 and has enough pairs for a game', () => {
    const phaseOne = deck.pairs.filter(p => p.phase <= deck.maxPhase);

    expect(phaseOne.length).toBeGreaterThanOrEqual(deck.pairsPerGame);
  });
});
