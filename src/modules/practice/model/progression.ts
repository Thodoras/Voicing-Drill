import { createVoicing, KEY_OPTIONS, QUALITIES } from './music';
import type { ProgressionChord, ProgressionSettings, Quality, SpelledRoot } from './types';

function keyRoot(pitchClass: number): SpelledRoot | undefined {
  const label = KEY_OPTIONS.find((option) => option.pitchClass === pitchClass)?.label;
  if (!label) return undefined;
  return { letter: label[0], acc: label.includes('♭') ? -1 : label.includes('♯') ? 1 : 0 };
}

function qualityById(id: string): Quality {
  const quality = QUALITIES.find((item) => item.id === id);
  if (!quality) throw new Error(`Unknown chord quality: ${id}`);
  return quality;
}

function movement(previous: number[], next: number[]): number {
  const sharedVoices = Math.min(previous.length, next.length);
  let score = 0;
  for (let index = 0; index < sharedVoices; index += 1) {
    score += Math.abs(previous[index] - next[index]);
  }
  return score + Math.abs(previous.length - next.length) * 12;
}

function optimizeProgressionRegister(chords: ProgressionChord[]): ProgressionChord[] {
  const octaveOptions = [0, -12, 12];
  let best = chords;
  let bestMovement = Number.POSITIVE_INFINITY;
  let bestShiftCount = Number.POSITIVE_INFINITY;

  for (let combination = 0; combination < octaveOptions.length ** chords.length; combination += 1) {
    let remaining = combination;
    let shiftCount = 0;
    const candidate = chords.map((chord) => {
      const shift = octaveOptions[remaining % octaveOptions.length];
      remaining = Math.floor(remaining / octaveOptions.length);
      if (shift === 0) return chord;
      shiftCount += 1;
      return {
        ...chord,
        prompt: { ...chord.prompt, midi: chord.prompt.midi.map((pitch) => pitch + shift) },
      };
    });
    const pitches = candidate.flatMap(({ prompt }) => prompt.midi);
    const keyboardStart = Math.floor(Math.min(...pitches) / 12) * 12;
    const keyboardEnd = keyboardStart + 12 * 2;
    if (Math.max(...pitches) >= keyboardEnd) continue;

    const movementScore = movement(candidate[0].prompt.midi, candidate[1].prompt.midi)
      + movement(candidate[1].prompt.midi, candidate[2].prompt.midi);
    if (
      movementScore < bestMovement
      || (movementScore === bestMovement && shiftCount < bestShiftCount)
    ) {
      best = candidate;
      bestMovement = movementScore;
      bestShiftCount = shiftCount;
    }
  }

  return best;
}

export function createProgression(settings: ProgressionSettings): ProgressionChord[] {
  const iiQuality = qualityById(settings.tonality === 'major' ? 'm9' : 'hd3');
  const dominant = qualityById(settings.dominantQuality);
  const tonicId = settings.tonality === 'major'
    ? settings.tonicQuality === '9' ? 'maj9' : '69'
    : settings.tonicQuality === '9' ? 'm9' : 'm69';
  const tonic = qualityById(tonicId);
  const inversion = settings.tonality === 'minor' && settings.inversion !== 2 ? 0 : settings.inversion;
  const chordSpecs = [
    { degree: 'ii' as const, rootPc: (settings.key + 2) % 12, quality: iiQuality },
    { degree: 'V' as const, rootPc: (settings.key + 7) % 12, quality: dominant },
    { degree: 'I' as const, rootPc: settings.key, quality: tonic },
  ];

  const chords = chordSpecs.map(({ degree, rootPc, quality }) => {
    let toneOrder: readonly string[] | undefined;
    if (settings.tonality === 'major' && degree === 'V') {
      const rootOrder: Record<string, readonly string[]> = {
        dom13: ['b7', '9', '3', '13'],
        dom13b9: ['b7', 'b9', '3', '13'],
        dom13b9b13: ['b7', 'b9', '3', 'b13'],
        alt: ['b7', 's9', '3', 'b13'],
      };
      const tones = rootOrder[settings.dominantQuality];
      if (tones) {
        toneOrder = tones.map((_, index) => tones[(index + inversion) % tones.length]);
      }
    } else if (settings.tonality === 'minor') {
      if (inversion === 0 && degree === 'V' && settings.dominantQuality === 'dom13b9b13') {
        toneOrder = ['b7', 'b9', '3', 'b13'];
      } else if (inversion === 2 && degree === 'ii') {
        toneOrder = ['b7', 'b3', 'b5'];
      } else if (inversion === 2 && degree === 'V' && settings.dominantQuality === 'dom13b9b13') {
        toneOrder = ['3', 'b13', 'b7', 'b9'];
      } else if (inversion === 2 && degree === 'I') {
        toneOrder = settings.tonicQuality === '9'
          ? ['b7', '9', 'b3', '5']
          : ['6', '9', 'b3', '5'];
      }
    }

    const prompt = createVoicing(rootPc, quality, inversion, 0, toneOrder);
    const tonicRoot = degree === 'I' ? keyRoot(rootPc) : undefined;
    return { degree, prompt: tonicRoot ? { ...prompt, root: tonicRoot } : prompt };
  });

  return optimizeProgressionRegister(chords);
}