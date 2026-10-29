import './PracticeHeader.css';

interface PracticeHeaderProps {
  count: number;
  onOpenSettings: () => void;
}

export default function PracticeHeader({ count, onOpenSettings }: PracticeHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">V</span>
        <div>
          <h1>Voicing Drill</h1>
          <p className="count-label" aria-live="polite">
            {count ? `Chord ${count}` : '4-note rootless voicings'}
          </p>
        </div>
      </div>
      <button className="settings-button" type="button" onClick={onOpenSettings}>
        <span className="settings-glyph" aria-hidden="true">☷</span>
        <span>Settings</span>
      </button>
    </header>
  );
}