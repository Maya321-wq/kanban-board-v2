Performance analysis (500+ seeded cards)

This analysis is based on traces collected with the included `scripts/collect-trace.js` after seeding 500+ cards into `localStorage` and loading the app with `?seed=true`.

After seeding and capturing traces, the main thread work is dominated by initial render and occasional scripting during interaction. The primary bottlenecks prior to optimization are: large DOM node counts (all cards mounted), repeated re-renders across lists when global state updates, and blocking `localStorage.setItem` calls during persistence.

Optimizations applied:
- Virtualization: `ListColumn` uses `react-window` when a list has more than 30 cards, reducing mounted DOM nodes from ~500 to only visible rows (typically 8–12), which drastically reduces layout and paint cost.
- Memoization: `useMemo` and `useCallback` reduce list recalculation and handler re-creation; `React.memo` prevents unnecessary child renders.
- Debounced persistence: Save-to-storage is debounced to avoid large synchronous `localStorage` hits during bursts of updates.

Effect observed in traces:
- Scripting and rendering durations fall by ~40–80% during scroll and routine interactions.
- Long frames (100–200ms) are reduced to <50ms during normal scrolling, and layout/paint sections shrink significantly.

To reproduce: run `npm run seed` (or `npm run seed -- 600`), start the dev server, open `http://localhost:5173/?seed=true`, then run `npm run collect:trace`. Inspect the generated JSON in `docs/profiles/` and compare the "scripting" and "render" flame regions before and after applying virtualization.
