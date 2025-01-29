import stylistic from '@stylistic/eslint-plugin-ts'

export default [
  {
    plugins: {
      '@stylistic': stylistic,
    },
    files: ['**/*.ts'],
    rules: {
      // your rules
    },
  },
]
