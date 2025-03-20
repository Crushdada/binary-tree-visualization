module.exports = {
    "root": true,
    "env": {
      "es6": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:vue/vue3-essential",
      "plugin:vue/vue3-strongly-recommended"
    ],
    "parserOptions": {
      "parser": "babel-eslint",
      "sourceType": "module"
    },
    "rules": {
        "no-console": "off"
    },
}