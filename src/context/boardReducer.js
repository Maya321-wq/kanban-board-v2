// src/context/boardReducer.js
import { v4 as uuidv4 } from 'uuid';

// Helper to get current timestamp
const now = () => Date.now();

// Initial state (required for offline-first)
export const initialState = {
  lists: [
    { id: 'list-todo', title: 'To Do', order: 0, archived: false, version: 1, lastModifiedAt: now() },
    { id: 'list-progress', title: 'In Progress', order: 1, archived: false, version: 1, lastModifiedAt: now() },
    { id: 'list-done', title: 'Done', order: 2, archived: false, version: 1, lastModifiedAt: now() },
  ],
  cards: [],
};

// Action types (use constants for safety)
export const ACTION_TYPES = {
  ADD_LIST: 'ADD_LIST',
  ADD_CARD: 'ADD_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
  MOVE_CARD: 'MOVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  RENAME_LIST: 'RENAME_LIST',
  ARCHIVE_LIST: 'ARCHIVE_LIST',
};

// Reducer function
export function boardReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_LIST: {
      const newList = {
        id: uuidv4(),
        title: action.payload.title,
        order: state.lists.length,
        archived: false,
        version: 1,
        lastModifiedAt: now(),
      };
      return {
        ...state,
        lists: [...state.lists, newList],
      };
    }

    case ACTION_TYPES.ADD_CARD: {
      const newCard = {
        id: uuidv4(),
        listId: action.payload.listId,
        title: action.payload.title,
        description: action.payload.description || '',
        tags: action.payload.tags || [],
        version: 1,
        lastModifiedAt: now(),
      };
      return {
        ...state,
        cards: [...state.cards, newCard],
      };
    }

    case ACTION_TYPES.UPDATE_CARD: {
      const { id, updates } = action.payload;
      const updatedCards = state.cards.map(card =>
        card.id === id
          ? {
              ...card,
              ...updates,
              version: card.version + 1,
              lastModifiedAt: now(),
            }
          : card
      );
      return { ...state, cards: updatedCards };
    }

    case ACTION_TYPES.MOVE_CARD: {
      const { cardId, sourceListId, targetListId, newIndex } = action.payload;
      // Remove from source
      const cards = state.cards.filter(card => !(card.id === cardId && card.listId === sourceListId));
      // Add to target (simplified; full DnD logic in component)
      const movedCard = state.cards.find(c => c.id === cardId);
      if (!movedCard) return state;
      cards.push({
        ...movedCard,
        listId: targetListId,
        version: movedCard.version + 1,
        lastModifiedAt: now(),
      });
      return { ...state, cards };
    }

    case ACTION_TYPES.DELETE_CARD: {
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload.id),
      };
    }

    case ACTION_TYPES.RENAME_LIST: {
      const { listId, title } = action.payload;
      const updatedLists = state.lists.map(list =>
        list.id === listId
          ? { ...list, title, version: list.version + 1, lastModifiedAt: now() }
          : list
      );
      return { ...state, lists: updatedLists };
    }

    case ACTION_TYPES.ARCHIVE_LIST: {
      const { listId } = action.payload;
      const updatedLists = state.lists.map(list =>
        list.id === listId
          ? { ...list, archived: true, version: list.version + 1, lastModifiedAt: now() }
          : list
      );
      // Optionally archive or delete cards (assignment says "archive lists")
      return { ...state, lists: updatedLists };
    }

    default:
      return state;
  }
}