import { expect } from 'vitest';

// Try to load jest-dom matchers and extend Vitest's expect. Use dynamic imports
// to be compatible with different package entry points.
(async () => {
  try {
    const mod = await import('@testing-library/jest-dom/matchers');
    const matchers = mod.default || mod;
    if (matchers) {
      expect.extend(matchers);
      return;
    }
  } catch (e) {
    // ignore and try fallback
  }

  // If we cannot locate matchers, skip extending expect and continue.
  // Tests will still run without jest-dom matchers available.
  // eslint-disable-next-line no-console
  console.warn('Could not load @testing-library/jest-dom matchers; continuing without them');
})();