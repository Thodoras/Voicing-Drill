import type { PracticeMode } from '../../../model/types';
import './PracticeModeSwitch.css';

interface PracticeModeSwitchProps {
  mode: PracticeMode;
  onChange: (mode: PracticeMode) => void;
}

const MODES: { value: PracticeMode; label: string }[] = [
  { value: 'single', label: 'Random chord' },
  { value: 'progression', label: 'ii–V–I progression' },
];

export default function PracticeModeSwitch({ mode, onChange }: PracticeModeSwitchProps) {
  return (
    <div className="mode-switch" role="group" aria-label="Practice mode">
      {MODES.map((option) => (
        <button
          className="mode-option"
          type="button"
          key={option.value}
          aria-pressed={mode === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}