import { useEffect, useRef } from 'react';
import { HANDS, INVERSIONS, QUALITIES } from '../../../model/music';
import type { Hand, Preferences } from '../../../model/types';
import './SettingsDialog.css';

interface SettingsDialogProps {
  open: boolean;
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
  onClose: () => void;
}

function toggleChoice<T extends string | number>(items: T[], value: T): T[] {
  if (items.includes(value)) {
    return items.length === 1 ? items : items.filter((item) => item !== value);
  }
  return [...items, value];
}

function displayTone(tone: string): string {
  return tone.replace(/^bb/, '𝄫').replace(/^b/, '♭').replace(/^s9$/, '#9');
}

export default function SettingsDialog({ open, preferences, onPreferencesChange, onClose }: SettingsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={dialogRef} className="settings-dialog" onClose={onClose}>
      <form method="dialog" className="settings-sheet">
        <div className="settings-heading">
          <div>
            <p className="eyebrow">Practice setup</p>
            <h2>What to practise</h2>
          </div>
          <button className="close-button" type="submit" aria-label="Close settings">×</button>
        </div>

        <fieldset className="option-group">
          <legend>Chord types</legend>
          <div className="chips">
            {QUALITIES.map((quality) => (
              <button
                className="chip"
                type="button"
                key={quality.id}
                aria-pressed={preferences.q.includes(quality.id)}
                onClick={() => onPreferencesChange({ ...preferences, q: toggleChoice(preferences.q, quality.id) })}
              >
                <span>C{quality.sym}</span>
                <small>{quality.tones.map(displayTone).join(' ')}</small>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="option-group">
          <legend>Inversions</legend>
          <div className="chips">
            {INVERSIONS.map((inversion, index) => (
              <button
                className="chip"
                type="button"
                key={inversion}
                aria-pressed={preferences.inv.includes(index)}
                onClick={() => onPreferencesChange({ ...preferences, inv: toggleChoice(preferences.inv, index) })}
              >
                {inversion}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="option-group">
          <legend>Hand</legend>
          <div className="chips">
            {HANDS.map((hand, index) => (
              <button
                className="chip"
                type="button"
                key={hand}
                aria-pressed={preferences.hand.includes(index as Hand)}
                onClick={() => onPreferencesChange({ ...preferences, hand: toggleChoice(preferences.hand, index as Hand) })}
              >
                {hand}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="settings-footer">
          <p>At least one option stays selected in each group.</p>
          <button className="done-button" type="submit">Done</button>
        </div>
      </form>
    </dialog>
  );
}