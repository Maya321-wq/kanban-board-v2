import { useContext, useCallback } from 'react';
import { BoardContext } from '../context/BoardProvider';
import { ACTION_TYPES } from '../context/boardReducer';

/**
 * Custom hook that provides access to the global board state and convenience 
 * actions for managing lists and cards.
 * 
 * Wraps the useReducer dispatch with typed action creators to ensure 
 * immutable updates and simplify component logic.
 * 
 * Must be used within a BoardProvider context.
 */
export function useBoardState() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardState must be used within BoardProvider');
  }
  const { state, dispatch } = context;

  // Convenience actions
  const addList = useCallback((title) => {
    console.log('Adding list:', title);
    dispatch({ type: ACTION_TYPES.ADD_LIST, payload: { title } });
  }, [dispatch]);

  const addCard = useCallback(({ listId, title, description = '', tags = [] }) => {
    console.log('Adding card:', { listId, title, description, tags });
    dispatch({ 
      type: ACTION_TYPES.ADD_CARD, 
      payload: { listId, title, description, tags } 
    });
  }, [dispatch]);

  const updateCard = useCallback((id, updates) => {
    console.log('Updating card:', id, updates);
    dispatch({ type: ACTION_TYPES.UPDATE_CARD, payload: { id, updates } });
  }, [dispatch]);

  const moveCard = useCallback((params) => {
    console.log('Moving card:', params);
    dispatch({ type: ACTION_TYPES.MOVE_CARD, payload: params });
  }, [dispatch]);

  const deleteCard = useCallback((id) => {
    console.log('Deleting card:', id);
    dispatch({ type: ACTION_TYPES.DELETE_CARD, payload: { id } });
  }, [dispatch]);

  const renameList = useCallback((listId, title) => {
    console.log('Renaming list:', listId, title);
    dispatch({ type: ACTION_TYPES.RENAME_LIST, payload: { listId, title } });
  }, [dispatch]);

  const archiveList = useCallback((listId) => {
    console.log('Archiving list:', listId);
    dispatch({ type: ACTION_TYPES.ARCHIVE_LIST, payload: { listId } });
  }, [dispatch]);

  return {
    state,
    dispatch,
    addList,
    addCard,
    updateCard,
    moveCard,
    deleteCard,
    renameList,
    archiveList,
  };
}