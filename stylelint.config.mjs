// Colors are defined once in src/styles/colors.css; everywhere else must use var(--…).
export default {
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-order'],
  rules: {
    'color-no-hex': true,
    'order/properties-alphabetical-order': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix',
    ],
    // Spacing is defined once in src/styles/spacing.css; everywhere else must use var(--…).
    'declaration-property-value-disallowed-list': {
      '/^(padding|margin|gap|row-gap|column-gap)(-.+)?$/': ['/\\d(px|rem|em)\\b/'],
    },
  },
  overrides: [
    {
      files: ['src/styles/spacing.css'],
      rules: {
        'declaration-property-value-disallowed-list': null,
      },
    },
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
