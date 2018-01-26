'use strict'
let path = require('path');
let styleLoaderConf = require('./styleLoaderConf');
let webpack = require('webpack');
let baseWebpackConfig = require('./webpack.config');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let merge = require("webpack-merge");
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
let OfflinePlugin = require('offline-plugin');
let config = require("./config");
let utils = require("./utils");
let CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = merge(baseWebpackConfig, {
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    module: {
        rules: [...styleLoaderConf.styleLoaders({
            sourceMap: false,
            extract: true
        })]
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        //TODO drop_console
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            },
            sourceMap: true
        }),
        new OfflinePlugin({
            ServiceWorker: {
                output: utils.assetsPath(`js/sw.${new Date().getTime()}.js`)
            }
        }),
        // extract css into its own file
        new ExtractTextPlugin({
            filename: utils.assetsPath('/css/[name].[contenthash:7].css'),
            disable: false,
            allChunks: true
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        // generate dist index.vue.html with correct asset hash for caching.
        // you can customize output by editing /index.vue.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // split vendor js-lib into its own file
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname, '../node_modules')
                    ) === 0
                )
            }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash from being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
        // copy custom static assets
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, '../src/staticJs'),
        //         to: utils.assetsPath('js/staticJs/'),
        //         ignore: ['.*']
        //     }
        // ])
    ]
})