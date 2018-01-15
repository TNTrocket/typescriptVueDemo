let path = require('path')
let vueLoaderConfig = require('./vue-loaderConf')

function resolve(dir) {
    return path.join(__dirname,"..",dir)
}

let webpackConfig = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: './js/[name].[hash:7].js',
        chunkFilename: "./js/[name].chunk.js"
    },
    resolve: {
        extensions: ['.js','.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'screens': resolve('src/screens'),
            'components': resolve('src/components'),
            'util': resolve("src/util")
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    }
}

module.exports = webpackConfig;