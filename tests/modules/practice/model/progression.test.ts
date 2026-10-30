import { describe, expect, it } from 'vitest';
import { createProgression, DEFAULT_PREFERENCES } from '../../../../src/modules/practice';

describe('createProgression', () => {
  it('preserves the root-position C major ii–V–I register when raising ii would add movement', () => {
    const progression = createProgression(
      {
        ...DEFAULT_PREFERENCES.progression,
        key: 0,
        tonality: 'major',
        dominantQuality: 'dom13',
        tonicQuality: '9',
        inversion: 0,
      },
    );

    expect(progression.map(({ degree }) => degree)).toEqual(['ii', 'V', 'I']);
    expect(progression.map(({ prompt }) => prompt.root)).toEqual([
      { letter: 'D', acc: 0 },
      { letter: 'G', acc: 0 },
      { letter: 'C', acc: 0 },
    ]);
    expect(progression.map(({ prompt }) => prompt.inv)).toEqual([0, 0, 0]);
    expect(progression.map(({ prompt }) => prompt.midi)).toEqual([
      [53, 57, 60, 64],
      [53, 57, 59, 64],
      [52, 55, 59, 62],
    ]);
  });

  it('uses the selected first inversion for every chord in a major progression', () => {
    const progression = createProgression(
      {
        ...DEFAULT_PREFERENCES.progression,
        inversion: 1,
      },
    );

    expect(progression.map(({ prompt }) => prompt.inv)).toEqual([1, 1, 1]);
  });

  it('rotates the optimized major V tone order through all four inversions', () => {
    const expectedV = [
      [5, 9, 11, 4],
      [9, 11, 4, 5],
      [11, 4, 5, 9],
      [4, 5, 9, 11],
    ];

    for (let inversion = 0; inversion < 4; inversion += 1) {
      const progression = createProgression({
        ...DEFAULT_PREFERENCES.progression,
        key: 0,
        tonality: 'major',
        dominantQuality: 'dom13',
        inversion,
        hand: 0,
      });

      expect(progression[1].prompt.inv).toBe(inversion);
      expect(progression[1].prompt.midi.map((midi) => midi % 12)).toEqual(expectedV[inversion]);
    }
  });

  it('builds a minor progression with a three-note half-diminished ii chord', () => {
    const progression = createProgression(
      {
        ...DEFAULT_PREFERENCES.progression,
        key: 9,
        tonality: 'minor',
        dominantQuality: 'dom13b9',
        tonicQuality: '9',
      },
    );

    expect(progression[0].prompt.q.id).toBe('hd3');
    expect(progression[0].prompt.midi).toHaveLength(3);
    expect(progression[1].prompt.q.id).toBe('dom13b9');
    expect(progression[2].prompt.q.id).toBe('m9');
  });

  it('keeps the root-position G minor ii–V–i in its base register', () => {
    const progression = createProgression({
      ...DEFAULT_PREFERENCES.progression,
      key: 7,
      tonality: 'minor',
      dominantQuality: 'dom13b9b13',
      tonicQuality: '9',
      inversion: 0,
      hand: 0,
    });

    expect(progression.map(({ prompt }) => prompt.inv)).toEqual([0, 0, 0]);
    expect(progression.map(({ prompt }) => prompt.midi)).toEqual([
      [60, 63, 67],
      [60, 63, 66, 70],
      [58, 62, 65, 69],
    ]);
  });

  it('uses second inversion for ii, V, and i in the minor second-inversion pattern', () => {
    const progression = createProgression({
      ...DEFAULT_PREFERENCES.progression,
      key: 7,
      tonality: 'minor',
      dominantQuality: 'dom13b9b13',
      inversion: 2,
      hand: 0,
    });

    expect(progression.map(({ prompt }) => prompt.inv)).toEqual([2, 2, 2]);
    expect(progression.map(({ prompt }) => prompt.midi)).toEqual([
      [55, 60, 63],
      [54, 58, 60, 63],
      [53, 57, 58, 62],
    ]);
  });

  it('raises D minor second-inversion ii when that reduces movement into V and i', () => {
    const progression = createProgression({
      ...DEFAULT_PREFERENCES.progression,
      key: 2,
      tonality: 'minor',
      dominantQuality: 'dom13b9b13',
      tonicQuality: '9',
      inversion: 2,
      hand: 0,
    });

    expect(progression.map(({ prompt }) => prompt.root)).toEqual([
      { letter: 'E', acc: 0 },
      { letter: 'A', acc: 0 },
      { letter: 'D', acc: 0 },
    ]);
    expect(progression.map(({ prompt }) => prompt.midi)).toEqual([
      [62, 67, 70],
      [61, 65, 67, 70],
      [60, 64, 65, 69],
    ]);
  });

  it('keeps C minor second-inversion ii in its base register when that is already closer', () => {
    const progression = createProgression({
      ...DEFAULT_PREFERENCES.progression,
      key: 0,
      tonality: 'minor',
      dominantQuality: 'dom13b9b13',
      inversion: 2,
      hand: 0,
    });

    expect(progression.map(({ prompt }) => prompt.midi)).toEqual([
      [60, 65, 68],
      [59, 63, 65, 68],
      [58, 62, 63, 67],
    ]);
  });

  it('lowers E-flat minor i when that reduces movement from ii and V', () => {
    const progression = createProgression({
      ...DEFAULT_PREFERENCES.progression,
      key: 3,
      tonality: 'minor',
      dominantQuality: 'dom13b9b13',
      inversion: 2,
      hand: 0,
    });

    expect(progression.map(({ prompt }) => prompt.midi)).toEqual([
      [51, 56, 59],
      [50, 54, 56, 59],
      [49, 53, 54, 58],
    ]);
  });

  it('spells the minor i chord with the selected key name', () => {
    const progression = createProgression({ ...DEFAULT_PREFERENCES.progression, key: 1, tonality: 'minor' });

    expect(progression[2].prompt.root).toEqual({ letter: 'D', acc: -1 });
  });

  it('applies the minor second-inversion tone pattern in every key', () => {
    for (let key = 0; key < 12; key += 1) {
      const progression = createProgression({
        ...DEFAULT_PREFERENCES.progression,
        key,
        tonality: 'minor',
        dominantQuality: 'dom13b9b13',
        tonicQuality: '9',
        inversion: 2,
        hand: 0,
      });
      const pitchClasses = progression.map(({ prompt }) => prompt.midi.map((midi) => midi % 12));

      expect(pitchClasses[0]).toEqual([
        (key + 12) % 12,
        (key + 5) % 12,
        (key + 8) % 12,
      ]);
      expect(pitchClasses[1]).toEqual([
        (key + 11) % 12,
        (key + 3) % 12,
        (key + 5) % 12,
        (key + 8) % 12,
      ]);
      expect(pitchClasses[2]).toEqual([
        (key + 10) % 12,
        (key + 2) % 12,
        (key + 3) % 12,
        (key + 7) % 12,
      ]);
    }
  });
});