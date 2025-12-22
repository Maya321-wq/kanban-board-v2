import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('../../../src/hooks/useBoardState', () => ({
  useBoardState: vi.fn(),
}));

import { useBoardState } from '../../../src/hooks/useBoardState';
import Card from '../../../src/components/Card';

describe('Card component', () => {
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    mockUpdate.mockReset();
    mockDelete.mockReset();
    useBoardState.mockReturnValue({ updateCard: mockUpdate, deleteCard: mockDelete });
  });

  it('renders card title and calls updateCard when edited', () => {
    const card = { id: 'c1', title: 'My card', description: '' };
    const promptSpy = vi.spyOn(window, 'prompt').mockImplementation(() => 'Edited');
    render(<Card card={card} listId={'list-1'} />);
    expect(screen.getByText('My card')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(`Edit card "${card.title}"`));
    expect(promptSpy).toHaveBeenCalled();
    expect(mockUpdate).toHaveBeenCalledWith('c1', { title: 'Edited' });
    promptSpy.mockRestore();
  });

  it('calls deleteCard when confirmed', () => {
    const card = { id: 'c2', title: 'Delete me' };
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    render(<Card card={card} listId={'list-1'} />);
    fireEvent.click(screen.getByLabelText(`Delete card "${card.title}"`));
    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('c2');
    confirmSpy.mockRestore();
  });
});
