Accessibility choices + testing

Accessibility was a deliberate part of the implementation. Key steps taken:

- Semantic controls and ARIA: critical buttons expose clear labels and aria attributes. For example, `Card.jsx` includes accessible buttons with `aria-label` for edit and delete (see `src/components/Card.jsx`, aria-labels around lines ~83–91), and `Board.jsx` marks the add-list control with `aria-label="Add new list"` (line ~99).

- Keyboard interaction for drag-and-drop: we include `KeyboardSensor` in the `DndContext` setup so users can move cards with keyboard controls (see `src/components/Board.jsx`, `useSensor(KeyboardSensor)` around line ~27). This gives keyboard-only users parity with pointer interactions.

- Focus and dialog semantics: modal confirmation uses `role="dialog"` and `aria-modal="true"` (`src/components/ConfirmDialog.jsx` lines ~1–12), and close buttons expose `aria-label` where relevant (e.g. `CardDetailModal.jsx` has a `Close modal` button listener at line ~17).

- Testing & tools: we included `@axe-core/react` as a dev dependency (see `package.json`) and validated interactive flows in Storybook-like scenarios. I also wrote integration checks with Testing Library to assert presence of `aria-label` attributes and basic keyboard sequences.

Debugging anecdote: during keyboard testing I found the DnD library swallowed certain key events; enabling the `KeyboardSensor` and testing with a headless keyboard simulation revealed the issue (fixed by ensuring the DnD context is mounted at `Board.jsx` line ~20). The change restored keyboard move accessibility and made automated keyboard tests reliable.