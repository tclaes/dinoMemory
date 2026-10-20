// Colors are defined once in src/styles/colors.css; everywhere else must use var(--…).
export default {
  customSyntax: 'postcss-scss',
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix',
    ],
  },
  overrides: [
    {
      files: ['src/styles/colors.css'],
      customSyntax: 'postcss',
      rules: {
        'color-no-hex': null,
        'function-disallowed-list': null,
      },
    },
  ],
};
