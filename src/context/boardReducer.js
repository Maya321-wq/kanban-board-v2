// src/context/boardReducer.js
import { v4 as uuidv4 } from 'uuid';

const now = () => Date.now();

export const initialState = {
  lists: [
    { 
      id: 'list-todo', 
      title: 'To Do', 
      order: 0, 
      archived: false, 
      version: 1, 
      lastModifiedAt: now() 
    },
    { 
      id: 'list-progress', 
      title: 'In Progress', 
      order: 1, 
      archived: false, 
      version: 1, 
      lastModifiedAt: now() 
    },
    { 
      id: 'list-done', 
      title: 'Done', 
      order: 2, 
      archived: false, 
      version: 1, 
      lastModifiedAt: now() 
    },
  ],
  cards: [],
};

export const ACTION_TYPES = {
  ADD_LIST: 'ADD_LIST',
  ADD_CARD: 'ADD_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
  MOVE_CARD: 'MOVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  RENAME_LIST: 'RENAME_LIST',
  ARCHIVE_LIST: 'ARCHIVE_LIST',
  RESTORE_LIST: 'RESTORE_LIST',
  RESTORE_CARD: 'RESTORE_CARD',
};

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
      return { ...state, lists: [...state.lists, newList] };
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
      console.log('✅ Card added:', newCard.title, 'to list:', newCard.listId);
      return { ...state, cards: [...state.cards, newCard] };
    }

    case ACTION_TYPES.UPDATE_CARD: {
      const { id, updates } = action.payload;
      const updatedCards = state.cards.map(card =>
        card.id === id
          ? { ...card, ...updates, version: card.version + 1, lastModifiedAt: now() }
          : card
      );
      return { ...state, cards: updatedCards };
    }

    case ACTION_TYPES.MOVE_CARD: {
      const { cardId, sourceListId, targetListId } = action.payload;
      
      console.log('🔄 MOVE_CARD reducer:', { cardId, sourceListId, targetListId });
      
      // Find the card to move
      const cardToMove = state.cards.find(card => card.id === cardId);
      
      if (!cardToMove) {
        console.warn('❌ Card not found:', cardId);
        return state;
      }
      
      console.log('📦 Found card:', cardToMove.title, 'currently in:', cardToMove.listId);
      
      // Update the card's listId
      const updatedCards = state.cards.map(card =>
        card.id === cardId
          ? { 
              ...card, 
              listId: targetListId,
              version: card.version + 1,
              lastModifiedAt: now() 
            }
          : card
      );
      
      console.log('✅ Card moved to:', targetListId);
      
      return { ...state, cards: updatedCards };
    }

    case ACTION_TYPES.DELETE_CARD: {
      return { 
        ...state, 
        cards: state.cards.filter(card => card.id !== action.payload.id) 
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
      return { ...state, lists: updatedLists };
    }

    case ACTION_TYPES.RESTORE_LIST: {
      const list = action.payload;
      const exists = state.lists.find(l => l.id === list.id);
      if (exists) return state;
      return { ...state, lists: [...state.lists, list] };
    }

    case ACTION_TYPES.RESTORE_CARD: {
      const card = action.payload;
      const exists = state.cards.find(c => c.id === card.id);
      if (exists) return state;
      return { ...state, cards: [...state.cards, card] };
    }

    default:
      return state;
  }
}