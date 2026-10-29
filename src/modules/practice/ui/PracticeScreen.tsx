import { usePractice } from '../hooks/usePractice';
import ChordPrompt from './components/ChordPrompt/ChordPrompt';
import PianoKeyboard from './components/PianoKeyboard/PianoKeyboard';
import PracticeActions from './components/PracticeActions/PracticeActions';
import PracticeHeader from './components/PracticeHeader/PracticeHeader';
import SettingsDialog from './components/SettingsDialog/SettingsDialog';
import './PracticeScreen.css';

export function PracticeScreen() {
  const practice = usePractice();

  return (
    <main className="app-shell">
      <PracticeHeader count={practice.count} onOpenSettings={practice.openSettings} />
      <ChordPrompt prompt={practice.prompt} onNext={practice.nextPrompt} />

      <section
        className="keyboard-panel"
        id="voicing-keyboard"
        aria-label="Voicing keyboard"
        hidden={!practice.preferences.kb}
      >
        <PianoKeyboard midi={practice.prompt.midi} />
      </section>

      <section className="answer-area" aria-label="Answer controls">
        <PracticeActions
          keyboardVisible={practice.preferences.kb}
          onToggleKeyboard={practice.toggleKeyboard}
          onPlay={practice.playVoicing}
        />
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