// npm i handlebars metalsmith -D
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = function (metadata = {}, src, dest = '.') {
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }

    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            .metadata(metadata)
            .clean(false)
            .source(src)
            .destination(dest)
            .use((files, metalsmith, done) => {
                const meta = metalsmith.metadata()
                // 目前仅定义替换package.json文件
                Object.keys(files).filter(x => x.includes('package.json')).forEach(fileName => {
                    const t = files[fileName].contents.toString()
                    
                    files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
                })
                done()
            }).build(err => {
                rm(src)
                err ? reject(err) : resolve()
            })
    })
}