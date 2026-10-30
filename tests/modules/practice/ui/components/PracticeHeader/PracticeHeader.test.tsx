import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PracticeHeader } from '../../../../../../src/modules/practice';

describe('PracticeHeader', () => {
  it('shows the title and forwards the settings action', async () => {
    const user = userEvent.setup();
    const onOpenSettings = vi.fn();
    render(<PracticeHeader onOpenSettings={onOpenSettings} />);

    expect(screen.getByRole('heading', { name: 'Voicing Drill' })).toBeInTheDocument();
    expect(screen.queryByText(/^Chord \d+$/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
});