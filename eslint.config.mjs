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
      'indent': ['error', 2], // Indentación de 2 espacios
      'semi': ['error', 'never'], // Sin punto y coma
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'], // Evita mezclar espacios y tabulaciones
    },
    plugins: {
      prettier: pluginObject
    },
  }
];