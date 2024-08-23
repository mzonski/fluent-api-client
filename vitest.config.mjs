import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		coverage: {
			provider: 'v8',
		},
		include: ['src/**/*.test.ts', 'src/**/*.test-d.ts'],
		setupFiles: ['./config/setupTests.ts'],
		typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
      tsconfig: './config/typescript/tsconfig.vitest.json',
		},
	},
	plugins: [],
});

