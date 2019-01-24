module.exports = {
    extends: 'standard',
    rules: {
        'comma-dangle': ['error', {
            arrays: 'always-multiline',
            exports: 'always-multiline',
            functions: 'ignore',
            imports: 'always-multiline',
            objects: 'always-multiline',
        }],
        'indent': ['error', 4, {
            SwitchCase: 1
        }],
        'operator-linebreak': ['error', 'before'],
        'semi': ['error', 'always'],
        'space-before-function-paren': ['error', {
            "anonymous": "always",
            "named": "never",
            "asyncArrow": "always"
        }],
    },
};
