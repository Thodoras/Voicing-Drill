export type ChordGroup = 'Major' | 'Minor' | 'Dominant' | 'Half-dim' | 'Diminished';
export type Hand = 0 | 1;

export interface Quality {
  id: string;
  sym: string;
  group: ChordGroup;
  tones: readonly string[];
}

export interface Preferences {
  q: string[];
  inv: number[];
  hand: Hand[];
  kb: boolean;
}

export interface SpelledRoot {
  letter: string;
  acc: number;
}

export interface Prompt {
  q: Quality;
  rootPc: number;
  inv: number;
  hand: Hand;
  root: SpelledRoot;
  midi: number[];
}