const zoniaEslintPlugin = require('eslint-plugin-zonia');

const zoniaTypescriptConfig = zoniaEslintPlugin.configs.typescript;

const configOverride = {
	...zoniaTypescriptConfig,
	root: true,
	env: {
		node: true,
		es2022: true,
	},
	settings: {
		react: {
			version: '18',
		},
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		project: ['./config/typescript/tsconfig.eslint.json'],
	},
	rules: {
		...zoniaTypescriptConfig.rules,
		'default-case-last': 'off',
		'no-console': 'off',
	},
	overrides: [
		{
			files: ['./config/build/**/*.mjs'],
			rules: {
				'import/no-extraneous-dependencies': 'off',
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],
};

module.exports = configOverride;
