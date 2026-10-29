import type { Hand, Preferences, Prompt, Quality } from './types';

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const FLAT = [[1, -1], [2, -1], [4, -1], [5, -1], [6, -1]] as const;
const SHARP = [[0, 1], [1, 1], [3, 1], [4, 1], [5, 1]] as const;
const BLACK = [1, 3, 6, 8, 10];
type RootFamily = 'Major' | 'Dominant' | 'Minor';
const ROOT_NAMES: Record<RootFamily, readonly (readonly [number, number])[]> = {
  Major: [FLAT[0], FLAT[1], FLAT[2], FLAT[3], FLAT[4]],
  Dominant: [FLAT[0], FLAT[1], SHARP[2], FLAT[3], FLAT[4]],
  Minor: [SHARP[0], FLAT[1], SHARP[2], FLAT[3], FLAT[4]],
};
const WHITE: Record<number, readonly [number, number]> = {
  0: [0, 0], 2: [1, 0], 4: [2, 0], 5: [3, 0], 7: [4, 0], 9: [5, 0], 11: [6, 0],
};

const TONES: Record<string, number> = {
  b3: 3, 3: 4, b5: 6, 5: 7, 6: 9, 13: 9, b13: 8, bb7: 9,
  b7: 10, 7: 11, b9: 13, 9: 14, s9: 15,
};

export const QUALITIES = [
  { id: 'maj9', sym: 'maj9', group: 'Major', tones: ['3', '5', '7', '9'] },
  { id: '69', sym: '6/9', group: 'Major', tones: ['3', '5', '6', '9'] },
  { id: 'm9', sym: 'm9', group: 'Minor', tones: ['b3', '5', 'b7', '9'] },
  { id: 'm69', sym: 'm6/9', group: 'Minor', tones: ['b3', '5', '6', '9'] },
  { id: 'mmaj9', sym: 'm9(maj7)', group: 'Minor', tones: ['b3', '5', '7', '9'] },
  { id: 'dom13b9', sym: '13♭9', group: 'Dominant', tones: ['3', '13', 'b7', 'b9'] },
  { id: 'dom13', sym: '13', group: 'Dominant', tones: ['3', '13', 'b7', '9'] },
  { id: 'alt', sym: '7alt', group: 'Dominant', tones: ['3', 'b13', 'b7', 's9'] },
  { id: 'hd', sym: 'ø(♭9)', group: 'Half-dim', tones: ['b3', 'b5', 'b7', 'b9'] },
] as const satisfies readonly Quality[];

export const INVERSIONS = ['Root position', '1st inversion', '2nd inversion', '3rd inversion'] as const;
export const HANDS = ['Left hand', 'Right hand'] as const;
export const ACCIDENTALS: Record<number, string> = { [-2]: '𝄫', [-1]: '♭', 0: '', 1: '♯', 2: '𝄪' };

export const DEFAULT_PREFERENCES: Preferences = {
  q: QUALITIES.map((quality) => quality.id),
  inv: [0, 1, 2, 3],
  hand: [0, 1],
  kb: true,
};

export function defaultPreferences(): Preferences {
  return {
    q: [...DEFAULT_PREFERENCES.q],
    inv: [...DEFAULT_PREFERENCES.inv],
    hand: [...DEFAULT_PREFERENCES.hand],
    kb: DEFAULT_PREFERENCES.kb,
  };
}

function rootSpelling(pitchClass: number, quality: Quality): { letterIndex: number; acc: number } {
  const white = WHITE[pitchClass];
  if (white) return { letterIndex: white[0], acc: white[1] };
  const family: RootFamily = quality.group === 'Major' || quality.group === 'Dominant' ? quality.group : 'Minor';
  const [letterIndex, acc] = ROOT_NAMES[family][BLACK.indexOf(pitchClass)];
  return { letterIndex, acc };
}

function stack(rootPc: number, semitones: number[], hand: Hand): number[] {
  const low = hand === 0 ? 50 : 60;
  let pitch = low + (((rootPc + semitones[0] - low) % 12 + 12) % 12);
  const result = [pitch];
  for (let index = 1; index < semitones.length; index += 1) {
    let next = pitch - ((pitch - (rootPc + semitones[index]) % 12) % 12 + 12) % 12;
    while (next <= pitch) next += 12;
    result.push((pitch = next));
  }
  return result;
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function createPrompt(preferences: Preferences, previous?: Prompt): Prompt {
  const qualities = QUALITIES.filter((quality) => preferences.q.includes(quality.id));
  if (!qualities.length || !preferences.inv.length || !preferences.hand.length) {
    throw new Error('Choose at least one chord quality, inversion, and hand.');
  }

  let quality = pick(qualities);
  let rootPc = Math.floor(Math.random() * 12);
  let attempts = 0;
  while (previous && attempts < 20 && rootPc === previous.rootPc && quality.id === previous.q.id) {
    quality = pick(qualities);
    rootPc = Math.floor(Math.random() * 12);
    attempts += 1;
  }

  const inv = pick(preferences.inv);
  const hand = pick(preferences.hand);
  const spelling = rootSpelling(rootPc, quality);
  const order = quality.tones.map((_, index) => quality.tones[(index + inv) % 4]);
  return {
    q: quality,
    rootPc,
    inv,
    hand,
    root: { letter: LETTERS[spelling.letterIndex], acc: spelling.acc },
    midi: stack(rootPc, order.map((toneId) => TONES[toneId] % 12), hand),
  };
}