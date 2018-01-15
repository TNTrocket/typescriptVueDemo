let express = require('express');
let path = require('path');
let proxy = require("http-proxy-middleware");

let app = express();

app.use(express.static('../dist'));
let proxyOptions = {
    // target: 'https://easy-mock.com/mock/5a5434d4aa6db1115269570c',
    target: 'http://ntce.free.ngrok.cc',
    changeOrigin: true,               // needed for virtual hosted sites
    ws: false,                         // proxy websockets
    pathRewrite: {
        '^/ntce-c' : '/ntce-c',     // rewrite path
    }
};

app.use(proxy("/ntce-c",proxyOptions));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname,'../dist/index.html'));
});
app.listen(8080, function() {
    console.log('正常打开8088端口')
});
