// src/utils/dnd.js
// Small helper to parse DnD draggable/list IDs in the form `card-<cardId>-list-<listId>`
// Behavior: split on the FIRST occurrence of `-list-` (after the `card-` prefix). If the
// resulting list part begins with a duplicated `list-` (e.g., `list-list-todo`), collapse
// the double prefix into a single `list-` so final listId becomes `list-todo`.
export function parseDraggableId(id) {
  if (!id || typeof id !== 'string') return null;

  const prefix = 'card-';
  const sep = '-list-';

  if (!id.startsWith(prefix)) return null;

  // Find first separator after the prefix
  const pos = id.indexOf(sep, prefix.length);
  if (pos === -1) return null;

  const cardId = id.substring(prefix.length, pos);
  let listRaw = id.substring(pos + sep.length);

  // Normalize double 'list-list-' -> 'list-'
  if (listRaw.startsWith('list-list-')) {
    listRaw = listRaw.substring('list-'.length);
  }

  if (!cardId || !listRaw) return null;
  return { cardId, listId: listRaw };
} 
