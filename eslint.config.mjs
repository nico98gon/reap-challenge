const pluginObject = {
  plugin: 'prettier'
}

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      'indent': ['error', 2],
      'semi': ['error', 'never'],
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
    plugins: {
      prettier: pluginObject
    },
  }
];