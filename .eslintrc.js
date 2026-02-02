module.exports = {
    extends: ['next/core-web-vitals', 'plugin:import/recommended', 'prettier'],
    rules: {
        'jsx-a11y/alt-text': 'off',
        'react/display-name': 'off',
        'react/no-children-prop': 'off',
        '@next/next/no-img-element': 'off',
        '@next/next/no-page-custom-font': 'off',

        // 🔹 Disabled blank line forcing
        'lines-around-comment': 'off',
        'padding-line-between-statements': 'off',
        'newline-before-return': 'off',

        // 🔹 Import rules disabled
        'import/newline-after-import': 'off',
        'import/order': 'off',
        'import/no-named-as-default-member': 'off',

        // 🔹 React hooks rules disabled
        'react-hooks/exhaustive-deps': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        },
        'import/parsers': {},
        'import/resolver': {
            node: {},
            typescript: {
                project: './jsconfig.json'
            }
        }
    },
    overrides: []
};
