Architecture choices

This project adopts a centralized state model with a small, well-defined set of components. Global state is owned by `BoardProvider` and updated exclusively through the `boardReducer` (see `src/context/boardReducer.js`, e.g. `initialState` and `ACTION_TYPES` around lines 1–44). Action creators are surfaced through the `useBoardState` hook (`src/hooks/useBoardState.js`, helpers like `addCard`, `moveCard` appear near line 27), so UI components remain thin and focused on rendering.

Component hierarchy and responsibilities:
- `Board.jsx` is the layout/drag orchestrator (see `CARD_ID_REGEX` and `handleDragEnd` at lines ~15 and ~30).
- `ListColumn.jsx` renders a single list and its controls (creation/rename/archive at lines ~16–19 and 71).
- `Card.jsx` renders a single card and exposes edit/delete via accessible buttons (see `aria-label`s near lines ~83–91).

Data flow is unidirectional: components call `useBoardState` helpers → helpers dispatch typed actions → reducer updates state → `BoardProvider` persists state to localStorage with a debounce to avoid frequent writes (see `src/context/BoardProvider.jsx` lines ~36–43). `useOfflineSync` (see `src/hooks/useOfflineSync.js` lines ~19–27 and the online handler at ~56) handles background syncing, keeping UI fast and optimistic.

Folder structure follows separation of concerns: `components/`, `hooks/`, `context/`, `services/`, and `tests/`. This makes unit-testing hooks/components straightforward and keeps side-effect code central and testable.