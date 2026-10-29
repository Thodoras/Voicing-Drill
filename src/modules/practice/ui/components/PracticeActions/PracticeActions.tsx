import './PracticeActions.css';

interface PracticeActionsProps {
  keyboardVisible: boolean;
  onToggleKeyboard: () => void;
  onPlay: () => void;
}

export default function PracticeActions({ keyboardVisible, onToggleKeyboard, onPlay }: PracticeActionsProps) {
  return (
    <div className="action-row">
      <button
        className="secondary-action"
        type="button"
        aria-expanded={keyboardVisible}
        aria-controls="voicing-keyboard"
        onClick={onToggleKeyboard}
      >
        <span className="action-icon" aria-hidden="true">{keyboardVisible ? '−' : '＋'}</span>
        {keyboardVisible ? 'Hide piano' : 'Show piano'}
      </button>
      <button className="primary-action" type="button" onClick={onPlay}>
        <span className="action-icon play-icon" aria-hidden="true">▶</span>
        Play
      </button>
    </div>
  );
}