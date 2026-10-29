import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PianoKeyboard } from '../../../../../../src/modules/practice';

describe('PianoKeyboard', () => {
  it('labels the keyboard and highlights each chord pitch', () => {
    const { container } = render(<PianoKeyboard midi={[60, 64, 67, 72]} />);

    expect(screen.getByRole('img', { name: 'Piano keyboard with the chord notes highlighted' })).toBeInTheDocument();
    expect(container.querySelectorAll('.key-hit')).toHaveLength(4);
  });
});