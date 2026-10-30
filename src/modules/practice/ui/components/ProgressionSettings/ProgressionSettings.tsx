import { HANDS, INVERSIONS, KEY_OPTIONS } from '../../../model/music';
import type { Hand, Preferences, ProgressionSettings as ProgressionSettingsModel } from '../../../model/types';

interface ProgressionSettingsProps {
  preferences: Preferences;
  onChange: (preferences: Preferences) => void;
}

export default function ProgressionSettings({ preferences, onChange }: ProgressionSettingsProps) {
  const progression = preferences.progression;
  const inversionOptions = progression.tonality === 'minor'
    ? [
      { value: 0, label: 'Root position' },
      { value: 2, label: '2nd inversion' },
    ]
    : INVERSIONS.map((label, value) => ({ value, label }));

  function update<K extends keyof ProgressionSettingsModel>(key: K, value: ProgressionSettingsModel[K]) {
    onChange({ ...preferences, progression: { ...progression, [key]: value } });
  }

  return (
    <>
      <fieldset className="option-group">
        <legend>Key and quality</legend>
        <div className="setting-grid">
          <label className="setting-control">
            <span>Key</span>
            <select value={progression.key} onChange={(event) => update('key', Number(event.target.value))}>
              {KEY_OPTIONS.map((option) => <option key={option.pitchClass} value={option.pitchClass}>{option.label}</option>)}
            </select>
          </label>
          <label className="setting-control">
            <span>Progression</span>
            <select
              value={progression.tonality}
              onChange={(event) => {
                const tonality = event.target.value as 'major' | 'minor';
                onChange({
                  ...preferences,
                  progression: {
                    ...progression,
                    tonality,
                    dominantQuality: tonality === 'minor' ? 'dom13b9b13' : 'dom13',
                      inversion: tonality === 'minor' && progression.inversion !== 2
                        ? 0
                        : progression.inversion,
                  },
                });
              }}
            >
              <option value="major">Major ii–V–I</option>
              <option value="minor">Minor iiø–V–i</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="option-group">
        <legend>Chord qualities</legend>
        <div className="setting-grid">
          <label className="setting-control">
            <span>V chord</span>
            <select
              value={progression.dominantQuality}
              onChange={(event) => update('dominantQuality', event.target.value as ProgressionSettingsModel['dominantQuality'])}
            >
              <option value="dom13">Dominant 13</option>
              <option value="dom13b9">Dominant 13♭9</option>
              <option value="dom13b9b13">Dominant ♭9♭13</option>
              <option value="alt">Altered dominant</option>
            </select>
          </label>
          <label className="setting-control">
            <span>I chord</span>
            <select value={progression.tonicQuality} onChange={(event) => update('tonicQuality', event.target.value as '9' | '6/9')}>
              <option value="9">9 chord</option>
              <option value="6/9">6/9 chord</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="option-group">
        <legend>Playback</legend>
        <div className="setting-grid">
          <label className="setting-control tempo-control">
            <span>Tempo <output>{progression.tempo} BPM</output></span>
            <input
              type="range"
              min="50"
              max="180"
              step="1"
              value={progression.tempo}
              onChange={(event) => update('tempo', Number(event.target.value))}
            />
          </label>
          <label className="setting-control">
            <span>Inversions</span>
            <select aria-label="Inversions" value={progression.inversion} onChange={(event) => update('inversion', Number(event.target.value))}>
              {inversionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="setting-control">
            <span>Hand</span>
            <select value={progression.hand} onChange={(event) => update('hand', Number(event.target.value) as Hand)}>
              {HANDS.map((hand, index) => <option key={hand} value={index}>{hand}</option>)}
            </select>
          </label>
        </div>
      </fieldset>
    </>
  );
}