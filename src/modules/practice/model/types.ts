export type ChordGroup = 'Major' | 'Minor' | 'Dominant' | 'Half-dim';
export type Hand = 0 | 1;
export type PracticeMode = 'single' | 'progression';
export type ProgressionTonality = 'major' | 'minor';
export type ProgressionDominantQuality = 'dom13' | 'dom13b9' | 'dom13b9b13' | 'alt';
export type ProgressionTonicQuality = '9' | '6/9';

export interface ProgressionSettings {
  key: number;
  tonality: ProgressionTonality;
  dominantQuality: ProgressionDominantQuality;
  tonicQuality: ProgressionTonicQuality;
  tempo: number;
  inversion: number;
}

export interface Quality {
  id: string;
  sym: string;
  group: ChordGroup;
  tones: readonly string[];
}

export interface Preferences {
  mode: PracticeMode;
  q: string[];
  inv: number[];
  hand: Hand[];
  kb: boolean;
  progression: ProgressionSettings;
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

export interface ProgressionChord {
  degree: 'ii' | 'V' | 'I';
  prompt: Prompt;
}