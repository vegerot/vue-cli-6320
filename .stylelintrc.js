module.exports = {
  extends: 'stylelint-config-standard-scss',
  defaultSeverity: 'warning',
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep'],
      },
    ],

    // remove later
    'no-descending-specificity': null,
  },
};
