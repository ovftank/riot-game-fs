import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const config = [
    js.configs.recommended,

    {
        name: 'base-config',
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {
            js
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser
            },
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'warn',
            reportUnusedInlineConfigs: 'warn'
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': 'off',
            'prefer-const': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'prefer-arrow-callback': 'error',
            'arrow-spacing': 'error',
            'prefer-template': 'error',
            'template-curly-spacing': 'error',
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            'eol-last': 'error',
            'comma-dangle': 'off',
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always']
        }
    },

    ...tseslint.configs.recommendedTypeChecked,

    {
        name: 'typescript-config',
        files: ['**/*.{ts,mts,cts}'],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/prefer-nullish-coalescing': 'error',
            '@typescript-eslint/prefer-optional-chain': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-non-null-assertion': 'warn'
        }
    },

    {
        name: 'ignore-config',
        ignores: ['node_modules/**', 'dist/**', '*.config.js', '*.config.mjs', 'coverage/**', '.git/**']
    }
];

export default config;
