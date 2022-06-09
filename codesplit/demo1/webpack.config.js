const path =  require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    // 多个入口文件 多入口
    entry:{
        main:'./src/main.js',
        app:'./src/app.js',
    },
    output:{
        path: path.resolve(__dirname,"dist"),
        filename: "[name].js", // webpack 命名方式 [name]的文件名自己命名
    },
    plugins:[
    new HtmlWebpackPlugin({
        template:path.resolve(__dirname,"public/index.html")
    })
    ],
    mode: 'production'
}