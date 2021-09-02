module.exports = {
    plugins: {
        autoprefixer: {},
        'postcss-px-to-viewport': {
            unitToConvert: 'px',
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 6,
            propList: ['*'],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: ['.ignore-'],
            minPixelValue: 1,
            mediaQuery: true,
            replace: true,
            exclude: [/node_modules/],
            landscape: false,
            landscapeUnit: 'vw',
            landscapeWidth: 1134,
        },
    },
};
