import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PracticeHeader } from '../../../../../../src/modules/practice';

describe('PracticeHeader', () => {
  it('shows progress and forwards the settings action', async () => {
    const user = userEvent.setup();
    const onOpenSettings = vi.fn();
    render(<PracticeHeader count={3} onOpenSettings={onOpenSettings} />);

    expect(screen.getByRole('heading', { name: 'Voicing Drill' })).toBeInTheDocument();
    expect(screen.getByText('Chord 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Settings' }));
    expect(onOpenSettings).toHaveBeenCalledOnce();
  });
});