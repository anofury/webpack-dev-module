module.exports = {
    dist: './build',
    mock: './_mocks_',
    static: './static',
    util: './src/utils',
    component: './src/components',
    template: './src/templates',
    window: {
        mainColor: '#FDCF4A',
        mainTapColor: '#F6B816',
    },
    extension: {
        stylesheet: '.less',
        javascript: '.js',
        entryoutput: '.entries',
    },
    entry: './src/modules',
    modules: {
        include: [
            // will ignore default, only works in development mode
            './src/modules/test-1/test1',
        ],
        default: [
            // module one
            './src/modules/test-1/test1',
            // module two
            './src/modules/test-2/test2',
        ],
    },
};
