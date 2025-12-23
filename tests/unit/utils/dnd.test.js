import { describe, it, expect } from 'vitest';
import { parseDraggableId } from '../../../src/utils/dnd';

describe('parseDraggableId', () => {
  it('parses standard ids', () => {
    const id = 'card-123-list-list-todo';
    const res = parseDraggableId(id);
    expect(res).toEqual({ cardId: '123', listId: 'list-todo' });
  });

  it('parses ids with inner dashes', () => {
    const id = 'card-card-abc123-list-list-progress';
    const res = parseDraggableId(id);
    expect(res).toEqual({ cardId: 'card-abc123', listId: 'list-progress' });
  });

  it('returns null on invalid input', () => {
    expect(parseDraggableId(null)).toBeNull();
    expect(parseDraggableId('something-else')).toBeNull();
  });
});
