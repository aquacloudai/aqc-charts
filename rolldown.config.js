import { defineConfig } from 'rolldown';

export default defineConfig({
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist',
            format: 'esm',
            entryFileNames: '[name].js',
            chunkFileNames: '[name]-[hash].js'
        },
        {
            dir: 'dist',
            format: 'cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: '[name]-[hash].cjs'
        }
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime', 'echarts'],
    platform: 'browser',
    treeshake: true,
    minify: true,
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname
        }
    }
});