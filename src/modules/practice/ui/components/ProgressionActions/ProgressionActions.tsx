import './ProgressionActions.css';

interface ProgressionActionsProps {
  keyboardVisible: boolean;
  isPlaying: boolean;
  onToggleKeyboard: () => void;
  onPlay: () => void;
  onStop: () => void;
}

export default function ProgressionActions({
  keyboardVisible,
  isPlaying,
  onToggleKeyboard,
  onPlay,
  onStop,
}: ProgressionActionsProps) {
  return (
    <div className="progression-actions">
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
      {isPlaying ? (
        <button className="primary-action" type="button" onClick={onStop}>
          <span className="action-icon" aria-hidden="true">■</span>
          Stop
        </button>
      ) : (
        <button className="primary-action" type="button" onClick={onPlay}>
          <span className="action-icon play-icon" aria-hidden="true">▶</span>
          Play progression
        </button>
      )}
    </div>
  );
}