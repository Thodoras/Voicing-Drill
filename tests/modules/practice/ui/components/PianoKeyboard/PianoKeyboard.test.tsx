import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PianoKeyboard } from '../../../../../../src/modules/practice';

describe('PianoKeyboard', () => {
  it('renders two octaves and highlights each chord pitch', () => {
    const { container } = render(<PianoKeyboard midi={[60, 64, 67, 72]} />);

    expect(screen.getByRole('img', { name: 'Piano keyboard with the chord notes highlighted' })).toBeInTheDocument();
    expect(container.querySelectorAll('.key-hit')).toHaveLength(4);
    expect(container.querySelectorAll('.key-white')).toHaveLength(14);
  });

  it('highlights C4 without adding an upper C endpoint', () => {
    const { container } = render(<PianoKeyboard midi={[54, 58, 60, 63]} rangeMidi={[54, 63]} />);

    expect(screen.getByText('C3')).toBeInTheDocument();
    expect(container.querySelectorAll('.key-hit')).toHaveLength(4);
    expect(container.querySelector('.key-white.key-hit[x="140.5"]')).toBeInTheDocument();
  });
});