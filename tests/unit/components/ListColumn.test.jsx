import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the hook module used by the component
vi.mock('../../../src/hooks/useBoardState', () => ({
  useBoardState: vi.fn(),
}));

// Partially mock react-window so virtualization renders in JSDOM tests
vi.mock('react-window', async (importOriginal) => {
  const actual = await importOriginal();
  const MockList = ({ children }) => <div role="list">{children}</div>;
  return {
    ...actual,
    FixedSizeList: MockList,
    // Also export `List` in case the compiled import expects it
    List: MockList,
  };
});

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

  it('uses virtualization when list has more than 30 cards', () => {
    // build 100 cards for the list
    const cards = Array.from({ length: 100 }).map((_, i) => ({ id: `c${i}`, listId: 'list-1', title: `T${i}` }));
    useBoardState.mockReturnValue({ state: { cards }, addCard: mockAddCard, renameList: mockRename, archiveList: mockArchive });

    render(<ListColumn list={{ id: 'list-1', title: 'Test List' }} />);

    // react-window renders an element with role="list" for the outer container
    const virtual = document.querySelector('[role="list"]');
    expect(virtual).toBeTruthy();
  });
});
