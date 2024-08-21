import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
	test: {
		globals: true,
		coverage: {
		  provider: 'v8',
		},
		setupFiles: ['./config/setupTests.ts'],
	},
	plugins: [],
});
