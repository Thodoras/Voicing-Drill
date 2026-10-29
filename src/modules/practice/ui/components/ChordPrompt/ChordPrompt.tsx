import { ACCIDENTALS, HANDS, INVERSIONS } from '../../../model/music';
import type { Prompt } from '../../../model/types';
import './ChordPrompt.css';

interface ChordPromptProps {
  prompt: Prompt;
  onNext: () => void;
}

export default function ChordPrompt({ prompt, onNext }: ChordPromptProps) {
  return (
    <button className="prompt-card" type="button" onClick={onNext} aria-live="polite">
      <span className="prompt-kicker">New voicing</span>
      <span className="chord-symbol">
        {prompt.root.letter}
        {prompt.root.acc !== 0 && <span className="accidental">{ACCIDENTALS[prompt.root.acc]}</span>}
        <span className="quality-symbol">{prompt.q.sym}</span>
      </span>
      <span className="prompt-meta">
        <span className="inversion-label">{INVERSIONS[prompt.inv]}</span>
        <span className="hand-label">{HANDS[prompt.hand]}</span>
      </span>
      <span className="card-hint">Tap for the next chord</span>
    </button>
  );
}