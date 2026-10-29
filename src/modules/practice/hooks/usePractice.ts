import { useEffect, useRef, useState } from 'react';
import { createPrompt } from '../model/music';
import type { Preferences, Prompt } from '../model/types';
import { loadPreferences, savePreferences } from '../api/preferencesStorage';

function playMidi(contextRef: { current: AudioContext | null }, midiNotes: number[]): void {
  try {
    const browserWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextConstructor = window.AudioContext || browserWindow.webkitAudioContext;
    if (!AudioContextConstructor) return;
    contextRef.current ??= new AudioContextConstructor();
    const context = contextRef.current;
    if (context.state === 'suspended') void context.resume();
    const start = context.currentTime;

    midiNotes.forEach((midi, index) => {
      const time = start + index * 0.04;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.16, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0008, time + 2.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(time);
      oscillator.stop(time + 2.3);
    });
  } catch {
    // Audio may be unavailable or blocked by the browser.
  }
}

export function usePractice() {
  const [preferences, setPreferences] = useState<Preferences>(() => loadPreferences());
  const [prompt, setPrompt] = useState<Prompt>(() => createPrompt(preferences));
  const [count, setCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => savePreferences(preferences), [preferences]);

  function nextPrompt() {
    setPrompt((previous) => createPrompt(preferences, previous));
    setCount((previous) => previous + 1);
  }

  function closeSettings() {
    setSettingsOpen(false);
    if (
      !preferences.q.includes(prompt.q.id)
      || !preferences.inv.includes(prompt.inv)
      || !preferences.hand.includes(prompt.hand)
    ) {
      setPrompt((previous) => createPrompt(preferences, previous));
      setCount((previous) => previous + 1);
    }
  }

  function playVoicing() {
    playMidi(audioContext, prompt.midi);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (settingsOpen || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const isTyping = target instanceof HTMLElement
        && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (isTyping) return;

      if ((event.code === 'Space' || event.code === 'Enter') && !(target instanceof HTMLButtonElement)) {
        event.preventDefault();
        nextPrompt();
      } else if (event.key.toLowerCase() === 'k') {
        setPreferences((previous) => ({ ...previous, kb: !previous.kb }));
      } else if (event.key.toLowerCase() === 'p') {
        playMidi(audioContext, prompt.midi);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [preferences, prompt, settingsOpen]);

  return {
    count,
    prompt,
    preferences,
    settingsOpen,
    setPreferences,
    nextPrompt,
    toggleKeyboard: () => setPreferences((previous) => ({ ...previous, kb: !previous.kb })),
    openSettings: () => setSettingsOpen(true),
    closeSettings,
    playVoicing,
  };
}