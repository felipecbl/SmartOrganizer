module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    "@typescript-eslint",
    "react"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["tsconfig.json"]
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/space-before-function-paren": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/dot-notation": "off",
    "react/prop-types": "off",
    "import/no-anonymous-default-export": 0,
    "react/react-in-jsx-scope": "off",
    "no-use-before-define": 0,
    "no-empty-pattern": "off",
    "linebreak-style": [0, "unix"],
    "jsx-quotes": [ "error", "prefer-double" ],
    "react/display-name": [ 0, { "ignoreTranspilerName": true } ],
    "indent": [ "warn", 2, { "SwitchCase": 1 } ],
    "quotes": [ "warn", "double" ],
    "semi": [ "error", "always" ]
  },
}
