const path = require("path")
const ESLINT_PLUGIN = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
    entry:"./src/main.js",
    output:{
        path:undefined,
        filename:"static/js/main.js",
        clean: true,
    },
    module:{
        rules:[
        {
            // 每个文件只能被其中一个loader种处理
            oneOf:[
            {
                test:/\.css$/,
                use:[
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test:/\.less$/,
                use:[
                "style-loader",
                "css-loader",
                "less-loader",
                ]
            },
            {
                test:/\.s[ac]ss$/,
                use:[
                "style-loader",
                "css-loader",
                "sass-loader",
                ]
            },
            {
                test:/\.styl$/,
                use:[
                "style-loader",
                "css-loader",
                "stylus-loader",
                ]
            },
            {
                test:/\.(png|jpe?g|gif|webp|svf)$/,
                type: "asset",
                parser:{
                    dataUrlCondition: {
                        // 10kb 转base64 优点减少请求数量，缺点会变大一点
                        maxSize: 10 * 1024,// 10kb
                    },
                },
                generator:{
                    // :10前10位
                    filename:"static/images/[hash:10][ext][query]",
                }
            },
            {
                test:/\.(ttf|woff2?|mp3|mp4|avi)$/,
                type: "asset/resource",
                generator:{
                    // :10前10位
                    filename:"static/media/[hash:10][ext][query]",
                }
            },{
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                }
            }

            ],
        }
        ]
        },
    plugins:[
        new ESLINT_PLUGIN({
            // 检测哪些文件
            context: path.resolve(__dirname,"../src")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"../public/index.html")
        })
    ],
    devServer:{
        host:"localhost", // 启动服务器的地址
        port:"3080", // 启动服务器端口号
        open:true,// 是否自动打开浏览器
        hot: true //false 关闭热加载 但是js没有做到这一点
    },
    mode : 'development',
    devtool: 'cheap-module-source-map'
    }