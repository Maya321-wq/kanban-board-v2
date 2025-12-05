// src/context/BoardProvider.jsx
import React, { createContext, useReducer, useEffect } from 'react';
import { boardReducer, initialState } from './boardReducer';
import { loadBoardFromStorage, saveBoardToStorage } from '../services/storage';

export const BoardContext = createContext(null);

export function BoardProvider({ children }) {
  // Initialize from IndexedDB or fallback to initialState
  const [state, dispatch] = useReducer(
    boardReducer,
    null,
    () => loadBoardFromStorage() || { ...initialState }
  );

  // Persist every state change
  useEffect(() => {
    saveBoardToStorage(state);
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}