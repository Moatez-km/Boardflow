import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],

  test: {
    globals: true,
    environment: 'node',

    include: [
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
      'test/**/*.spec.ts',
      'test/**/*.test.ts',
    ],

    exclude: [
      'node_modules',
      'dist',
      'coverage',
      'test/**/*.e2e-spec.ts',
    ],

    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',

      exclude: [
        'src/main.ts',
        'src/**/*.module.ts',
        'src/**/*.dto.ts',
        'src/**/*.entity.ts',
        'src/**/*.type.ts',
      ],

      thresholds: {
        lines: 80,
        functions: 70,
        branches: 70,
        statements: 80,
      },
    },
  },
});
