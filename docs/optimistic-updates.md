Optimistic updates

The optimistic-update flow in this project is deliberately simple and transparent: user actions are applied to the local state immediately, queued for background sync, and retried when necessary. In practice this is implemented as follows:

1) User triggers a helper from `useBoardState` (e.g. `addCard` or `moveCard`) — see `src/hooks/useBoardState.js` (helpers around line ~27). Those helpers dispatch a typed action (e.g. `ADD_CARD`) to `boardReducer`.

2) The reducer (`src/context/boardReducer.js`, `case ACTION_TYPES.ADD_CARD` at line ~62) creates a new entity (UUID generated in the reducer) and returns updated state; the UI re-renders immediately because the reducer updates synchronously.

3) The action is also persisted to the local sync queue (`src/services/storage.js`, `saveSyncQueue` at lines ~100–111) so it can be picked up when the network is available.

4) `useOfflineSync` (see `src/hooks/useOfflineSync.js` around lines ~19–27 and the online handler at line ~56) periodically loads the queue (`loadSyncQueue`) and sends each queued action to `apiClient.syncAction` for server reconciliation. Successful items are removed from the queue; failures are re-queued.

Debugging anecdote: while writing tests I observed a flake where `Add card` was triggered twice in React StrictMode during mount. The test failure led me to use `getAllByText` in tests and to confirm that the reducer-generated UUIDs (see `boardReducer.js` line ~62) avoid collisions when duplicates happen. This made the optimistic flow robust to double-mounts during development.