import { ACCIDENTALS, KEY_OPTIONS } from '../../../model/music';
import type { ProgressionChord, ProgressionTonality } from '../../../model/types';
import './ProgressionSequence.css';

interface ProgressionSequenceProps {
  chords: ProgressionChord[];
  keyPitchClass: number;
  tonality: ProgressionTonality;
  activeIndex: number;
  isPlaying: boolean;
  onSelectChord: (index: number) => void;
}

export default function ProgressionSequence({
  chords,
  keyPitchClass,
  tonality,
  activeIndex,
  isPlaying,
  onSelectChord,
}: ProgressionSequenceProps) {
  const keyName = KEY_OPTIONS.find((option) => option.pitchClass === keyPitchClass)?.label ?? 'C';

  return (
    <section className="progression-sequence" aria-label={`${keyName} ${tonality} ii V I progression`}>
      <p className="progression-key">{keyName} {tonality}</p>
      <ol className="progression-chords">
        {chords.map(({ degree, prompt }, index) => (
          <li key={degree}>
            <button
              className={index === activeIndex ? 'progression-step active' : 'progression-step'}
              type="button"
              aria-current={index === activeIndex ? 'step' : undefined}
              onClick={() => onSelectChord(index)}
            >
              <span className="progression-degree">{degree}</span>
              <strong>
                {prompt.root.letter}{ACCIDENTALS[prompt.root.acc]}{prompt.q.sym}
              </strong>
              {isPlaying && index === activeIndex && <span className="playing-indicator">Now playing</span>}
            </button>
          </li>
        ))}
      </ol>
      <p className="progression-caption" aria-live="polite">
        {isPlaying ? `Chord ${activeIndex + 1} of ${chords.length}` : 'Ready to play'}
      </p>
    </section>
  );
}