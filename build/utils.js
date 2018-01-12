let glob = require('glob');

function getEntries(globPath) {
    // 获取所有匹配文件的文件名数组
    let files = glob.sync(globPath),
        entries = {};

    files.forEach(function (filepath) {
        // 取倒数第二层(view下面的文件夹)做包名
        let splitArray = filepath.split('/')
        let name = splitArray[splitArray.length - 2]
        // 保存{'目录名': '目录路径'}
        entries[name] = './' + filepath
    })
    return entries
}

// 获取所有匹配src下目录的文件夹名字，其中文件夹里main.js为页面入口
let entries = getEntries('screens/**/main.js')

module.exports = {
    entries: entries
}
