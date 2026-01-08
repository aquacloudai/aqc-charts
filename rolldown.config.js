import { defineConfig } from 'rolldown';

export default defineConfig({
    input: {
        index: 'src/index.ts',
        legacy: 'src/legacy.ts',
    },
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
    external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'echarts',
        'echarts-stat',
        /^echarts\//,      // Match echarts/core, echarts/types/*, etc.
        /^echarts-stat\//  // Match echarts-stat sub-paths if any
    ],
    platform: 'browser',
    treeshake: true,
    minify: true,
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname
        }
    }
});