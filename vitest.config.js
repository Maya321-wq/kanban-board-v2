import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run unit tests (hooks + components) and integration tests for reducer/sync
    include: [
      'tests/unit/hooks/**/*.test.*',
      'tests/unit/components/**/*.test.*',
      'tests/integration/**/*.test.*'
    ],
    exclude: ['tests/e2e/**'],
    environment: 'jsdom',
    setupFiles: 'tests/setup.js',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});