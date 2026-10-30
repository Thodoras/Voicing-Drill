import { usePractice } from '../hooks/usePractice';
import ChordPrompt from './components/ChordPrompt/ChordPrompt';
import PianoKeyboard from './components/PianoKeyboard/PianoKeyboard';
import PracticeActions from './components/PracticeActions/PracticeActions';
import PracticeHeader from './components/PracticeHeader/PracticeHeader';
import PracticeModeSwitch from './components/PracticeModeSwitch/PracticeModeSwitch';
import ProgressionActions from './components/ProgressionActions/ProgressionActions';
import ProgressionSequence from './components/ProgressionSequence/ProgressionSequence';
import SettingsDialog from './components/SettingsDialog/SettingsDialog';
import './PracticeScreen.css';

export function PracticeScreen() {
  const practice = usePractice();
  const progressionMidi = practice.progression.flatMap(({ prompt }) => prompt.midi);

  return (
    <main className="app-shell">
      <PracticeHeader count={practice.count} onOpenSettings={practice.openSettings} />
      <PracticeModeSwitch mode={practice.preferences.mode} onChange={practice.changeMode} />

      {practice.preferences.mode === 'single' ? (
        <ChordPrompt prompt={practice.prompt} onNext={practice.nextPrompt} />
      ) : (
        <ProgressionSequence
          chords={practice.progression}
          keyPitchClass={practice.preferences.progression.key}
          tonality={practice.preferences.progression.tonality}
          activeIndex={practice.activeProgressionIndex}
          isPlaying={practice.isPlaying}
          onSelectChord={practice.playProgressionChord}
        />
      )}

      <section
        className="keyboard-panel"
        id="voicing-keyboard"
        aria-label="Voicing keyboard"
        hidden={practice.preferences.mode === 'single' && !practice.preferences.kb}
      >
        <PianoKeyboard
          midi={practice.preferences.mode === 'single'
            ? practice.prompt.midi
            : practice.progression[practice.activeProgressionIndex].prompt.midi}
          rangeMidi={practice.preferences.mode === 'progression' ? progressionMidi : undefined}
        />
      </section>

      <section className="answer-area" aria-label="Answer controls">
        {practice.preferences.mode === 'single' ? (
          <PracticeActions
            keyboardVisible={practice.preferences.kb}
            onToggleKeyboard={practice.toggleKeyboard}
            onPlay={practice.playVoicing}
          />
        ) : (
          <ProgressionActions
            isPlaying={practice.isPlaying}
            onPlay={practice.playProgression}
            onStop={practice.stopProgression}
          />
        )}
      </section>

      <SettingsDialog
        open={practice.settingsOpen}
        preferences={practice.preferences}
        onPreferencesChange={practice.setPreferences}
        onClose={practice.closeSettings}
      />
    </main>
  );
}