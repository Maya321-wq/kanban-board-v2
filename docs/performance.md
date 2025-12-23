Performance testing and guidance

Setup and seeding
- Run `npm run seed` to generate a `public/seed-state.js` file that contains a 500-card dataset. Then start the dev server with `npm run dev` and open the app at `http://localhost:5173/?seed=true` to populate `localStorage` with the seeded state.

What's implemented
- Virtualization: `ListColumn` now uses `react-window`'s `FixedSizeList` when a list contains more than 30 cards; this renders only visible cards and keeps frame times low during scroll.
- Memoization: per-list card arrays are created with `useMemo`, and event handlers use `useCallback` to avoid unnecessary re-renders. `Card` and `ListColumn` remain wrapped with `React.memo`.
- Debounced persistence: `BoardProvider` already debounces saves to `localStorage` (300ms), reducing main-thread blocking when many updates happen quickly.

Profiling evidence (how to capture and what to include)

1. With the seeded dataset open, open Chrome DevTools → Performance and record a trace while scrolling, adding cards, and doing some drag/drop operations. Save the trace as JSON and place it in `docs/profiles/` (e.g., `docs/profiles/trace-seed-500.json`).
2. Alternatively, use the React Profiler (in React DevTools) to record an export and save it to `docs/profiles/react-prof-seed-500.json`.

Automated trace collection

- A helper is included to automate trace capture using Playwright: run `npm run collect:trace`. This will navigate to `http://localhost:5173/?seed=true`, exercise scrolling, and write a trace JSON into `docs/profiles/` (path printed to the console).

Example analysis (150–250 words) — add this after you capture a real trace

- After seeding 500 cards and recording a Chrome Performance trace, the main thread showed intermittent long frames during initial renders and during rapid state updates. The primary bottlenecks were synchronous `localStorage.setItem` calls and large re-render trees when the global board state changed. By debouncing persistence and scoping renders to per-list selections (using `useMemo` and `React.memo`), we significantly reduced both scripting time and paint time. Virtualization reduced the number of mounted DOM nodes from ~500 to only the visible window (~8–12 nodes depending on viewport), which cut total layout and paint work proportionally. In a typical dev trace, this moves long frames (100–200ms) down to sub-50ms frames during normal scrolling and interactions; paint and composite layers become noticeably lighter and the FPS improves during scroll. To reproduce, compare a trace before and after enabling virtualization and memoization: look for reductions in "scripting" and "render" flame areas and smaller "Recalculate Style" and "Layout" durations tied to the list components. Describe exact numbers and include screenshots or exported trace files in `docs/profiles/` for verification.