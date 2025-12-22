import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the hook module used by the component
vi.mock('../../../src/hooks/useBoardState', () => ({
  useBoardState: vi.fn(),
}));

import { useBoardState } from '../../../src/hooks/useBoardState';
import ListColumn from '../../../src/components/ListColumn';

describe('ListColumn', () => {
  const mockAddCard = vi.fn();
  const mockRename = vi.fn();
  const mockArchive = vi.fn();

  beforeEach(() => {
    mockAddCard.mockReset();
    mockRename.mockReset();
    mockArchive.mockReset();

    useBoardState.mockReturnValue({
      state: { cards: [] },
      addCard: mockAddCard,
      renameList: mockRename,
      archiveList: mockArchive,
    });
  });

  it('renders list title and add card button', () => {
    render(<ListColumn list={{ id: 'list-1', title: 'Test List' }} />);
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('Add card')).toBeInTheDocument();
  });

  it('prompts for new card and calls addCard', () => {
    // stub prompt
    const promptSpy = vi.spyOn(window, 'prompt').mockImplementation(() => 'New Card');
    render(<ListColumn list={{ id: 'list-1', title: 'Test List' }} />);
    const btns = screen.getAllByText('Add card');
    // React StrictMode may mount twice during tests; pick the first instance
    expect(btns.length).toBeGreaterThan(0);
    fireEvent.click(btns[0]);
    expect(promptSpy).toHaveBeenCalled();
    expect(mockAddCard).toHaveBeenCalledWith({ listId: 'list-1', title: 'New Card' });
    promptSpy.mockRestore();
  });
});
