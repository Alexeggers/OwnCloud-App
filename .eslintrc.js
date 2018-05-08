module.exports = {
    extends: ['prettier', 'prettier/react'],

    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true
    },
    plugins: ['react', 'import', 'prettier'],
    globals: {
        __static: true
    },
    rules: {
        'prettier/prettier': [
            'warn',
            {
                useTabs: false,
                tabWidth: 4,
                singleQuote: true,
                printWidth: 120
            }
        ],
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-dupe-class-members': 2,
        'new-cap': 0,
        strict: [2, 'global'],
        'no-trailing-spaces': 1,
        'key-spacing': 1,
        'no-useless-constructor': 1,
        'no-confusing-arrow': 1,
        'no-this-before-super': 2,
        'no-undef': 2,
        'no-underscore-dangle': 0,
        'no-use-before-define': 0,
        'no-multi-spaces': 0,
        'no-unused-vars': 1,
        'no-mixed-spaces-and-tabs': 1,
        'no-empty': 1,
        'eol-last': 1,
        semi: 1,
        'semi-spacing': 1,
        'comma-dangle': 0,
        'comma-spacing': 1,
        'jsx-quotes': 0,
        'constructor-super': 2,
        'react/jsx-boolean-value': 1,
        'react/jsx-no-undef': 2,
        'react/jsx-uses-react': 1,
        'react/jsx-uses-vars': 1,
        'react/no-did-mount-set-state': 1,
        'react/no-did-update-set-state': 1,
        'react/no-multi-comp': 0,
        'react/no-unknown-property': 1,
        'react/react-in-jsx-scope': 1,
        'react/self-closing-comp': 1,
        'react/wrap-multilines': 0,
        'react/jsx-no-duplicate-props': 2,
        'react/prop-types': 2,
        'import/no-unresolved': [
            2,
            {
                commonjs: true,
                amd: true
            }
        ],
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2,
        'import/no-named-as-default': 0
    }
};
