import { defineConfig } from '@rolldown/rolldown';

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
    external: ['react', 'react-dom', 'echarts'],
    platform: 'browser',
    treeshake: true,
    minify: true,
    resolve: {
        alias: {
            '@': './src'
        }
    },
    plugins: [
        // SWC for fast TypeScript compilation
        {
            name: 'swc',
            transform: {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                        decorators: false,
                        dynamicImport: true
                    },
                    target: 'es2020',
                    loose: false,
                    externalHelpers: false,
                    keepClassNames: false,
                    transform: {
                        react: {
                            runtime: 'automatic',
                            development: false
                        }
                    }
                },
                module: {
                    type: 'es6'
                },
                minify: false,
                sourceMaps: true
            }
        }
    ]
});