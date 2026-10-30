import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { PracticeScreen } from '../../../../src/modules/practice';

beforeEach(() => localStorage.clear());

describe('PracticeScreen', () => {
  it('advances to the next prompt without showing a chord counter', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);

    await user.click(screen.getByRole('button', { name: /tap for the next chord/i }));
    expect(screen.getByRole('button', { name: /tap for the next chord/i })).toBeInTheDocument();
    expect(screen.queryByText(/^Chord \d+$/)).not.toBeInTheDocument();
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

  it('switches to the C major ii–V–I progression and offers four inversions', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);

    await user.click(screen.getByRole('button', { name: 'ii–V–I progression' }));

    expect(screen.getByRole('region', { name: 'C major ii V I progression' })).toBeInTheDocument();
    expect(screen.getByText('Dm9')).toBeInTheDocument();
    expect(screen.getByText('G13')).toBeInTheDocument();
    expect(screen.getByText('Cmaj9')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(Array.from(screen.getByRole('combobox', { name: 'Inversions' }).querySelectorAll('option'))
      .map((option) => option.value)).toEqual(['0', '1', '2', '3']);
  });

  it('always shows the piano in progression mode', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);
    await user.click(screen.getByRole('button', { name: 'Hide piano' }));
    await user.click(screen.getByRole('button', { name: 'ii–V–I progression' }));

    expect(screen.queryByRole('button', { name: /piano/i })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Voicing keyboard' })).toBeVisible();
  });

  it('selects a progression chord when it is tapped', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);
    await user.click(screen.getByRole('button', { name: 'ii–V–I progression' }));

    await user.click(screen.getByRole('button', { name: /G13/ }));

    expect(screen.getByRole('button', { name: /G13/ })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: /Dm9/ })).not.toHaveAttribute('aria-current');
  });

  it('plays, stops, and can be started again', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);
    await user.click(screen.getByRole('button', { name: 'ii–V–I progression' }));

    await user.click(screen.getByRole('button', { name: 'Play progression' }));
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Stop' }));
    await user.click(screen.getByRole('button', { name: 'Play progression' }));
    expect(screen.getByRole('button', { name: 'Stop' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Stop' }));
  });

  it('updates the displayed progression when its key changes in settings', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);

    await user.click(screen.getByRole('button', { name: 'ii–V–I progression' }));
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Key' }), '8');
    act(() => (screen.getByRole('dialog') as HTMLDialogElement).close());

    expect(screen.getByRole('region', { name: 'A♭ major ii V I progression' })).toBeInTheDocument();
    expect(screen.getByText('B♭m9')).toBeInTheDocument();
    expect(screen.getByText('E♭13')).toBeInTheDocument();
    expect(screen.getByText('A♭maj9')).toBeInTheDocument();
  });

  it('defaults the dominant V chord to flat 9 flat 13 when switching to minor', async () => {
    const user = userEvent.setup();
    render(<PracticeScreen />);

    await user.click(screen.getByRole('button', { name: 'ii–V–I progression' }));
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Progression' }), 'minor');

    expect(screen.getByRole('combobox', { name: 'V chord' })).toHaveValue('dom13b9b13');
    expect(Array.from(screen.getByRole('combobox', { name: 'Inversions' }).querySelectorAll('option'))
      .map((option) => option.value)).toEqual(['0', '2']);
  });
});