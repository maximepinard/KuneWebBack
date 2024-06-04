module.exports = {
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier',
    './eslint-rules/best-practices.cjs',
    './eslint-rules/errors.cjs',
    './eslint-rules/node.cjs',
    './eslint-rules/style.cjs',
    './eslint-rules/variables.cjs',
    './eslint-rules/es6.cjs',
    './eslint-rules/imports.cjs',
    './eslint-rules/strict.cjs',
    './eslint-rules/prettier.cjs'
  ],
  parserOptions: { ecmaVersion: 2022 },
  overrides: [
    {
      files: ['*.js, *.jsx']
    }
  ]
};
