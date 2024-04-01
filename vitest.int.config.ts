import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/*.int.test.ts', '**/*.e2e.test.ts'],
    globalSetup: './src/tests/integration/global-setup.ts',
    fileParallelism: false,
    maxConcurrency: 1,
    maxWorkers: 1,
  },
  plugins: [
    // This is required to build the test files with SWC
    // Which allows NestJS to be tested in e2e
    // https://github.com/nestjs/nest/issues/9228
    swc.vite(),
  ],
});
