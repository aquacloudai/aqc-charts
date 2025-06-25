module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'error'
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
};