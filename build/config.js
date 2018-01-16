let path = require('path')

module.exports = {
    build: {
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/ntce-c/',
    },
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
    }
}
