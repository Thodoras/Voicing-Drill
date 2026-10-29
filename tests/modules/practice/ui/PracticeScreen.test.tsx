import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { PracticeScreen } from '../../../../src/modules/practice';

beforeEach(() => localStorage.clear());

describe('PracticeScreen', () => {
  it('advances to the next prompt', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);

    await user.click(screen.getByRole('button', { name: /tap for the next chord/i }));
    expect(screen.getByText('Chord 1')).toBeInTheDocument();
  });

  it('shows and hides the piano from the practice actions', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);

    expect(screen.getByRole('region', { name: 'Voicing keyboard' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hide piano' }));
    expect(screen.queryByRole('region', { name: 'Voicing keyboard' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show piano' }));
    expect(screen.getByRole('region', { name: 'Voicing keyboard' })).toBeInTheDocument();
  });
});