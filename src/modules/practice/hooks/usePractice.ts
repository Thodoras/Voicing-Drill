import { useEffect, useRef, useState } from 'react';
import { createPrompt } from '../model/music';
import { createProgression } from '../model/progression';
import type { Preferences, PracticeMode, Prompt } from '../model/types';
import { loadPreferences, savePreferences } from '../api/preferencesStorage';

function playMidi(
  contextRef: { current: AudioContext | null },
  activeNodes: { current: AudioScheduledSourceNode[] },
  midiNotes: number[],
): void {
  try {
    activeNodes.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // The note may have already ended.
      }
    });
    activeNodes.current = [];
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
      activeNodes.current.push(oscillator);
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProgressionIndex, setActiveProgressionIndex] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const activeAudioNodes = useRef<AudioScheduledSourceNode[]>([]);
  const progressionTimer = useRef<number | null>(null);

  useEffect(() => savePreferences(preferences), [preferences]);

  function stopAudio() {
    activeAudioNodes.current.forEach((node) => {
      try {
        node.stop();
      } catch {
        // The note may have already ended.
      }
    });
    activeAudioNodes.current = [];
  }

  function stopProgression() {
    if (progressionTimer.current !== null) {
      window.clearTimeout(progressionTimer.current);
      progressionTimer.current = null;
    }
    stopAudio();
    setIsPlaying(false);
  }

  function nextPrompt() {
    stopProgression();
    setPrompt((previous) => createPrompt(preferences, previous));
    setCount((previous) => previous + 1);
  }

  function closeSettings() {
    stopProgression();
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
    playMidi(audioContext, activeAudioNodes, prompt.midi);
  }

  function playProgression() {
    stopProgression();
    const progression = createProgression(preferences.progression);
    const chordDuration = (60_000 / preferences.progression.tempo) * 4;
    setIsPlaying(true);

    function playStep(index: number) {
      setActiveProgressionIndex(index);
      playMidi(audioContext, activeAudioNodes, progression[index].prompt.midi);
      progressionTimer.current = window.setTimeout(() => {
        if (index === progression.length - 1) {
          progressionTimer.current = null;
          setIsPlaying(false);
        } else {
          playStep(index + 1);
        }
      }, chordDuration);
    }

    playStep(0);
  }

  function playProgressionChord(index: number) {
    stopProgression();
    const chord = createProgression(preferences.progression)[index];
    if (!chord) return;
    setActiveProgressionIndex(index);
    playMidi(audioContext, activeAudioNodes, chord.prompt.midi);
  }

  function openSettings() {
    stopProgression();
    setSettingsOpen(true);
  }

  function changeMode(mode: PracticeMode) {
    stopProgression();
    setPreferences((current) => ({ ...current, mode }));
  }

  useEffect(() => () => {
    if (progressionTimer.current !== null) window.clearTimeout(progressionTimer.current);
    stopAudio();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (settingsOpen || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const isTyping = target instanceof HTMLElement
        && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (isTyping) return;

      if ((event.code === 'Space' || event.code === 'Enter') && !(target instanceof HTMLButtonElement)) {
        event.preventDefault();
        if (preferences.mode === 'single') nextPrompt();
        else if (isPlaying) stopProgression();
        else playProgression();
      } else if (event.key.toLowerCase() === 'k') {
        setPreferences((previous) => ({ ...previous, kb: !previous.kb }));
      } else if (event.key.toLowerCase() === 'p') {
        if (preferences.mode === 'single') playMidi(audioContext, activeAudioNodes, prompt.midi);
        else if (isPlaying) stopProgression();
        else playProgression();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [preferences, prompt, settingsOpen, isPlaying]);

  const progression = createProgression(preferences.progression);

  return {
    count,
    prompt,
    progression,
    preferences,
    isPlaying,
    activeProgressionIndex,
    settingsOpen,
    setPreferences,
    nextPrompt,
    toggleKeyboard: () => setPreferences((previous) => ({ ...previous, kb: !previous.kb })),
    changeMode,
    openSettings,
    closeSettings,
    playVoicing,
    playProgression,
    playProgressionChord,
    stopProgression,
  };
}