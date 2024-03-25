module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "error",
    "jsx-quotes": ["error", "prefer-double"],
    "no-trailing-spaces": "error",
    "no-console": "off",
    "linebreak-style": 0,
    "max-len": ["warn", { code: 500 }],
    "import/prefer-default-export": "off",
    "comma-dangle": "off",
    "no-plusplus": "off",
    "react/jsx-props-no-spreading": "off",
    "no-nested-ternary": "off",
    "react/jsx-no-bind": "off",
    "react/no-unknown-property": ["error", { ignore: ["position"] }],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/no-extraneous-dependencies": "off",
  },
};
