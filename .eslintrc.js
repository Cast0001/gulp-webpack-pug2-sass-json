module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "globals": {
        "BROWSER": true,
        "API_DOMAIN": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "installedESLint": true,
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-case-declarations": 0,
        "no-console": 0
    }
}
;
