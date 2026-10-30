import type { ReactNode } from 'react';
import './PianoKeyboard.css';

interface PianoKeyboardProps {
  midi: number[];
  rangeMidi?: number[];
}

const BLACK_PITCHES = new Set([1, 3, 6, 8, 10]);
const KEYBOARD_OCTAVES = 2;

export default function PianoKeyboard({ midi, rangeMidi = midi }: PianoKeyboardProps) {
  const start = Math.floor(Math.min(...rangeMidi) / 12) * 12;
  const whiteWidth = 20;
  const height = 90;
  const blackWidth = 12;
  const blackHeight = 54;
  const whites: ReactNode[] = [];
  const blacks: ReactNode[] = [];
  let whiteIndex = 0;

  for (let pitch = start; pitch < start + 12 * KEYBOARD_OCTAVES; pitch += 1) {
    const pitchClass = pitch % 12;
    if (!BLACK_PITCHES.has(pitchClass)) {
      const selected = midi.includes(pitch);
      whites.push(
        <g key={pitch}>
          <rect
            className={selected ? 'key-white key-hit' : 'key-white'}
            x={whiteIndex * whiteWidth + 0.5}
            y="0.5"
            width={whiteWidth - 1}
            height={height - 1}
            rx="2"
          />
          {pitchClass === 0 && !selected && (
            <text className="key-label" x={whiteIndex * whiteWidth + whiteWidth / 2} y={height - 6} textAnchor="middle">
              C{Math.floor(pitch / 12) - 1}
            </text>
          )}
        </g>,
      );
      whiteIndex += 1;
    } else {
      blacks.push(
        <rect
          key={pitch}
          className={midi.includes(pitch) ? 'key-black key-hit' : 'key-black'}
          x={whiteIndex * whiteWidth - blackWidth / 2}
          y="0"
          width={blackWidth}
          height={blackHeight}
          rx="1.5"
        />,
      );
    }
  }

  return (
    <svg
      className="keyboard-svg"
      viewBox={`0 0 ${whiteIndex * whiteWidth} ${height}`}
      role="img"
      aria-label="Piano keyboard with the chord notes highlighted"
    >
      {whites}
      {blacks}
    </svg>
  );
}