export interface Pair {
  key: string;
  letter: string;
  word: string;
  emoji: string;
  phase: number;
  highlight?: string;
}

export interface Deck {
  cards?: string[];
  frontFace?: string;
  imgURL?: string;
  name: string;
  pairs?: Pair[];
  pairsPerGame?: number;
  maxPhase?: number;
}
