module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'import/no-unresolved': [2, { ignore: ['@/(.*?)'] }],
    'vue/experimental-script-setup-vars': [0],
    'no-use-before-define': [0],
    'camelcase': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'quote-props': 0,
  },
  globals: {
    _: true,
    // $: true,
  },
};
