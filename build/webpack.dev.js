'use strict'
let path = require('path')
let styleLoaderConf = require('./styleLoaderConf')
let webpack = require('webpack')
let baseWebpackConfig = require('./webpack.config')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let merge = require("webpack-merge");



module.exports = merge(baseWebpackConfig,{
    entry: {
        app: ['./mocks/index.js','./src/main.ts','webpack-hot-middleware/client?reload=true']
    },
    module: {
        rules: [...styleLoaderConf.styleLoaders({sourceMap: true})]
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: true
        }),
    ]
})

