// let isDev = process.env.NODE_ENV === 'dev'
let styleLoader = require('./styleLoaderConf')

module.exports = {
    loaders: styleLoader.cssLoaders({
        sourceMap: process.env.NODE_ENV === "development",
        extract: process.env.NODE_ENV === "production"
    }),
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    },
    cssModules: {
        localIdentName: '[name]-[local]-[hash:base64:5]',
        camelCase: true
    }
}