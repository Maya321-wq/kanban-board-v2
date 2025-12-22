import { useReducer, useCallback } from 'react';

/**
 * Custom hook for managing undo/redo functionality for board operations.
 * 
 * Maintains a history stack with a maximum of 50 entries to prevent memory issues.
 * Supports multi-level undo/redo as required by assignment §5.
 * 
 * @param {Object} initialState - The initial board state
 * @param {Function} reducer - The board reducer function
 * @returns {{
 *   state: Object,
 *   dispatch: Function,
 *   undo: Function,
 *   redo: Function,
 *   canUndo: boolean,
 *   canRedo: boolean
 * }}
 */
export function useUndoRedo(initialState, reducer) {
  const MAX_HISTORY = 50;

  const [historyState, historyDispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'ACTION': {
          const newPresent = reducer(state.present, action.payload);
          const newPast = [...state.past, state.present].slice(-MAX_HISTORY);
          return {
            past: newPast,
            present: newPresent,
            future: [], // Clear future on new action
          };
        }

        case 'UNDO': {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, -1);
          return {
            past: newPast,
            present: previous,
            future: [state.present, ...state.future],
          };
        }

        case 'REDO': {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          return {
            past: [...state.past, state.present],
            present: next,
            future: newFuture,
          };
        }

        default:
          return state;
      }
    },
    {
      past: [],
      present: initialState,
      future: [],
    }
  );

  const dispatch = useCallback(
    (action) => {
      historyDispatch({ type: 'ACTION', payload: action });
    },
    [historyDispatch]
  );

  const undo = useCallback(() => {
    historyDispatch({ type: 'UNDO' });
  }, [historyDispatch]);

  const redo = useCallback(() => {
    historyDispatch({ type: 'REDO' });
  }, [historyDispatch]);

  return {
    state: historyState.present,
    dispatch,
    undo,
    redo,
    canUndo: historyState.past.length > 0,
    canRedo: historyState.future.length > 0,
  };
}