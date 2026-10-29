import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { defaultPreferences, SettingsDialog } from '../../../../../../src/modules/practice';

describe('SettingsDialog', () => {
  it('shows practice choices and reports quality changes', async () => {
    const user = userEvent.setup();
    const preferences = defaultPreferences();
    const onPreferencesChange = vi.fn();
    render(
      <SettingsDialog
        open
        preferences={preferences}
        onPreferencesChange={onPreferencesChange}
        onClose={vi.fn()}
      />,
    );

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByRole('heading', { name: 'What to practise' })).toBeInTheDocument();
    await user.click(dialog.getByRole('button', { name: /Cm9/ }));
    expect(onPreferencesChange).toHaveBeenCalledWith({
      ...preferences,
      q: preferences.q.filter((quality) => quality !== 'm9'),
    });
  });
});