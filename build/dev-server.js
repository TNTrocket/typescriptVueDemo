'use strict'
let path = require('path')
let express = require('express')
let webpack = require('webpack')
let webpackConfig = require('./webpack.dev')
let WebpackDevMiddleware = require('webpack-dev-middleware')
let WebpackHotMiddleware = require('webpack-hot-middleware')
let proxy = require("http-proxy-middleware");
let opn = require("opn");


let app = express()

let proxyOptions = {
    // target: 'https://easy-mock.com/mock/5a5434d4aa6db1115269570c',
    target: 'http://192.168.1.2:10081',
    changeOrigin: true,               // needed for virtual hosted sites
    ws: false,                         // proxy websockets
    pathRewrite: {
        '^/ntce-c' : '/ntce-c',     // rewrite path
    }
};



let compiler = webpack(webpackConfig);


app.use(WebpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: {
        colors: true,
        chunks: false
    },
    progress: true,
    inline: true,
    hot: true
}))

app.use(WebpackHotMiddleware(compiler))
app.use(proxy("/ntce-c",proxyOptions));
// 路由
// app.get("/",function (req, res, next) {
//     res.redirect("/news");
// })
// app.get('/:pagename?', function (req, res, next) {
//     let pagename = 'index.html'
//
//     let filepath = path.join(compiler.outputPath, pagename)
//
//     // 使用webpack提供的outputFileSystem
//     compiler.outputFileSystem.readFile(filepath, function (err, result) {
//         if (err) {
//             // something error
//          console.log(err)
//         }
//         // 发送获取到的页面
//         res.set('content-type', 'text/html')
//         res.send(result)
//         res.end()
//     })
// })


app.listen(3000, function (err) {
    if (err) {
        // do something
        return
    }
    // opn('http://localhost:80880800', {app: 'google chrome'});
    // console.log('Listening at http://localhost:8080\n')
})