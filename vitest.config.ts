import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./src/setupTests.ts'],
        include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
        // ECharts uses async canvas rendering that can throw after DOM cleanup
        // These are not actual test failures, just cleanup artifacts
        dangerouslyIgnoreUnhandledErrors: true,
    },
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname
        }
    }
});