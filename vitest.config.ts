import { defaultExclude, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.test.ts'],
    exclude: [...defaultExclude, '**/*.e2e.test.ts', '**/*.int.test.ts'],
  },
});
