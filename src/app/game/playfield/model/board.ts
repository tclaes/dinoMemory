export type CardFace =
  | { kind: 'image' }
  | { kind: 'letter'; text: string }
  | { kind: 'word'; text: string; emoji: string; highlight?: string };

export interface BoardCard {
  id: string;
  name: string;
  coverIndex: number;
  /** Cards with the same pairKey form a pair. Defaults to `name`. */
  pairKey?: string;
  /** What the card shows when face up. Defaults to the deck image. */
  face?: CardFace;
}
