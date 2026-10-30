import './PracticeHeader.css';

interface PracticeHeaderProps {
  onOpenSettings: () => void;
}

export default function PracticeHeader({ onOpenSettings }: PracticeHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">V</span>
        <h1>Voicing Drill</h1>
      </div>
      <button className="settings-button" type="button" onClick={onOpenSettings}>
        <span className="settings-glyph" aria-hidden="true">☷</span>
        <span>Settings</span>
      </button>
    </header>
  );
}