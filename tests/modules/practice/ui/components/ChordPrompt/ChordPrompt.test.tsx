import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChordPrompt, createPrompt, defaultPreferences } from '../../../../../../src/modules/practice';

describe('ChordPrompt', () => {
  it('renders the prompt details and forwards next-prompt action', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const prompt = createPrompt({ ...defaultPreferences(), q: ['maj9'], inv: [0], hand: [0] });
    render(<ChordPrompt prompt={prompt} onNext={onNext} />);

    expect(screen.getByText('maj9')).toBeInTheDocument();
    expect(screen.getByText('Root position')).toBeInTheDocument();
    expect(screen.getByText('Left hand')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /tap for the next chord/i }));
    expect(onNext).toHaveBeenCalledOnce();
  });
});