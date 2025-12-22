import { describe, it, expect } from 'vitest';
import { boardReducer, initialState, ACTION_TYPES } from '../../src/context/boardReducer';

describe('boardReducer', () => {
  it('adds a list', () => {
    const res = boardReducer(initialState, { type: ACTION_TYPES.ADD_LIST, payload: { title: 'New' } });
    expect(res.lists.length).toBe(initialState.lists.length + 1);
    expect(res.lists[res.lists.length - 1].title).toBe('New');
  });

  it('adds and moves a card', () => {
    const afterAdd = boardReducer(initialState, { type: ACTION_TYPES.ADD_CARD, payload: { listId: 'list-todo', title: 'C' } });
    expect(afterAdd.cards.length).toBe(1);
    const card = afterAdd.cards[0];
    const moved = boardReducer(afterAdd, { type: ACTION_TYPES.MOVE_CARD, payload: { cardId: card.id, sourceListId: 'list-todo', targetListId: 'list-progress' } });
    expect(moved.cards.find(c => c.id === card.id).listId).toBe('list-progress');
  });

  it('renames and archives lists', () => {
    const renamed = boardReducer(initialState, { type: ACTION_TYPES.RENAME_LIST, payload: { listId: 'list-todo', title: 'Renamed' } });
    expect(renamed.lists.find(l => l.id === 'list-todo').title).toBe('Renamed');

    const archived = boardReducer(initialState, { type: ACTION_TYPES.ARCHIVE_LIST, payload: { listId: 'list-done' } });
    expect(archived.lists.find(l => l.id === 'list-done').archived).toBe(true);
  });
});
