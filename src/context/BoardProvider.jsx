import React, { createContext, useReducer, useEffect, useRef } from 'react';
import { boardReducer, initialState } from './boardReducer';

export const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  // Load initial state once
  const getInitialState = () => {
    try {
      const saved = localStorage.getItem('kanban-board-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lists && parsed.lists.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
    return initialState;
  };

  const [state, dispatch] = useReducer(boardReducer, null, getInitialState);
  const saveTimeoutRef = useRef(null);
  const isFirstRenderRef = useRef(true);

  // Save to localStorage with debounce (prevent infinite loop)
  useEffect(() => {
    // Skip first render to avoid overwriting on mount
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('kanban-board-state', JSON.stringify(state));
        console.log('💾 Saved');
      } catch (e) {
        console.error('Save error:', e);
      }
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}





