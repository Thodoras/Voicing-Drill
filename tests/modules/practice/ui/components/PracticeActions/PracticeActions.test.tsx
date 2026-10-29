import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PracticeActions } from '../../../../../../src/modules/practice';

describe('PracticeActions', () => {
  it('reports reveal and playback actions', async () => {
    const user = userEvent.setup();
    const onToggleKeyboard = vi.fn();
    const onPlay = vi.fn();
    render(<PracticeActions keyboardVisible onToggleKeyboard={onToggleKeyboard} onPlay={onPlay} />);

    const pianoToggle = screen.getByRole('button', { name: 'Hide piano' });
    expect(pianoToggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(pianoToggle);
    await user.click(screen.getByRole('button', { name: 'Play' }));
    expect(onToggleKeyboard).toHaveBeenCalledOnce();
    expect(onPlay).toHaveBeenCalledOnce();
  });
});