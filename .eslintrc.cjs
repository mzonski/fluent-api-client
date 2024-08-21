const prettierConfig = require('zonia-config-prettier');

const nodeRules = {
	'import/no-extraneous-dependencies': 'off',
	'@typescript-eslint/no-var-requires': 'off',
};

const configOverride = {
	root: true,
	env: {
		node: true,
		es2022: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		project: ['./tsconfig.json'],
	},
	extends: [
		// defaults
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		// libs
		'plugin:prettier/recommended',
		'plugin:import/typescript',
	],
	plugins: ['@typescript-eslint', 'prettier', 'import', 'regexp', 'sonarjs'],
	rules: {
		'default-case-last': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '[iI]gnored',
			},
		],
		'import/export': 'warn',
		'import/extensions': 'warn',
		'import/named': 'warn',
		'import/newline-after-import': 'warn',
		'import/no-named-as-default': 'off',
		'import/no-unresolved': 'warn',
		'import/order': [
			'warn',
			{
				'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
				'newlines-between': 'always',
				'alphabetize': {
					order: 'asc',
					caseInsensitive: true,
				},
			},
		],
		'import/prefer-default-export': 'off',
		'prettier/prettier': ['warn', prettierConfig],
		'sonarjs/prefer-immediate-return': 'off',
		'sonarjs/prefer-single-boolean-return': 'off',
	},
	overrides: [
		{
			files: ['./config/build/**/*.mjs'],
			rules: {
				...nodeRules,
			},
		},
		{
			files: ['**/__tests__/*.{j,t}s?(x)'],
			env: {
				'vitest-globals/env': true,
			},
			extends: ['plugin:vitest-globals/recommended'],
			rules: {
				...nodeRules,
			},
		},
	],
};

module.exports = configOverride;
