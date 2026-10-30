import './ProgressionActions.css';

interface ProgressionActionsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export default function ProgressionActions({ isPlaying, onPlay, onStop }: ProgressionActionsProps) {
  return (
    <div className="progression-actions">
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