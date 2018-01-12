let ora = require('ora')
let rm = require('rimraf')
let path = require('path')
let chalk = require('chalk')
let webpack = require('webpack')
let webpackConfig = require('./webpack.pro')


// 开始输出loading状态
let spinner = ora('building for production...')
spinner.start()

rm(path.join(__dirname, '..', 'dist'), err => {
    if (err) throw err

    webpack(webpackConfig, function (err, stats) {
        spinner.stop()

        // 输出错误信息
        if (err) throw err

        // 输出打包完成信息
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        console.log(chalk.cyan('  Build complete: '  + '\n'))
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ))
    })
});
