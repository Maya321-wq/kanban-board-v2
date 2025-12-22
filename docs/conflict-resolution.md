Conflict resolution approach

We adopt a pragmatic three-way merge approach oriented around version numbers and `lastModifiedAt` timestamps embedded in model objects (see `lists` and `cards` shapes defined in `src/context/boardReducer.js`, lines ~1–16). Each entity carries `version` and `lastModifiedAt` so we can reason about concurrent edits.

Three-way-merge outline:
- Base: the last common version (server snapshot known to both client and server).
- Local: the client’s optimistic changes (un-synced actions in the queue).
- Remote: the server authoritative state returned by a sync request.

Merge strategy:
- For non-conflicting fields, accept both changes.
- For simple conflicts (different fields changed), apply both using a field-wise merge and increase version.
- For direct conflicts (same field modified), prefer the most recent edit by `lastModifiedAt` and present a conflict UI if ambiguity remains.

Where to implement: conflict resolution is invoked during sync in `useOfflineSync` (`src/hooks/useOfflineSync.js` lines ~23–31). Currently the repo uses *restore* actions (`ACTION_TYPES.RESTORE_*` in `src/context/boardReducer.js`, e.g. `case ACTION_TYPES.RESTORE_LIST` at ~145) to reintroduce server state. For unresolved conflicts we rely on an explicit confirmation step (e.g. `ConfirmDialog.jsx`, role and controls at lines ~1–12) to present choices to users.

When a merge is non-trivial, the UI blocks the field with a clear message and shows the `ConfirmDialog` so the user can pick which value to keep. This keeps automated merges conservative and user-visible.