// src/hooks/useBoardState.js
import { useContext, useCallback } from 'react';
import { BoardContext } from '../context/BoardProvider';
import { ACTION_TYPES } from '../context/boardReducer';

export function useBoardState() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoardState must be used within BoardProvider');
  }
  const { state, dispatch } = context;

  // Convenience actions
  const addList = useCallback((title) => {
    dispatch({ type: ACTION_TYPES.ADD_LIST, payload: { title } });
  }, [dispatch]);

  const addCard = useCallback(({ listId, title, description = '', tags = [] }) => {
    dispatch({ type: ACTION_TYPES.ADD_CARD, payload: { listId, title, description, tags } });
  }, [dispatch]);

  const updateCard = useCallback((id, updates) => {
    dispatch({ type: ACTION_TYPES.UPDATE_CARD, payload: { id, updates } });
  }, [dispatch]);

  const moveCard = useCallback((cardId, sourceListId, targetListId) => {
    dispatch({
      type: ACTION_TYPES.MOVE_CARD,
      payload: { cardId, sourceListId, targetListId },
    });
  }, [dispatch]);

  const deleteCard = useCallback((id) => {
    dispatch({ type: ACTION_TYPES.DELETE_CARD, payload: { id } });
  }, [dispatch]);

  const renameList = useCallback((listId, title) => {
    dispatch({ type: ACTION_TYPES.RENAME_LIST, payload: { listId, title } });
  }, [dispatch]);

  const archiveList = useCallback((listId) => {
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