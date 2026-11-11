// Colors are defined once in src/styles/colors.css and fonts (family, size, weight) in
// src/styles/typography.css; everywhere else must use var(--…).
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
    'declaration-property-value-allowed-list': {
      '/^font-(family|size|weight)$/': ['/^var\\(--[\\w-]+\\)$/', 'inherit', 'initial', 'unset', 'revert'],
    },
    // The `font` shorthand would bypass the check above.
    'property-disallowed-list': ['font'],
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
    {
      files: ['src/styles/typography.css'],
      customSyntax: 'postcss',
      rules: {
        'declaration-property-value-allowed-list': null,
        // Only the scale below may exist. A new token means a deliberate edit here, so
        // component- or role-specific tokens (e.g. --font-size-title) cannot slip in.
        'custom-property-pattern': [
          '^font-(family-(display|body|default)|weight-(semibold|bold|extrabold)|size-(xs|s|m|ml|base|l|card-(letter|emoji|word)))$',
          { message: 'Reuse an existing font token; add a scale step only by extending this pattern.' },
        ],
      },
    },
  ],
};
