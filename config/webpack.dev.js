const path = require("path")
const os = require('os')
const ESLINT_PLUGIN = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const threads = os.cpus().length // cpu核数
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
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
                // exclude: /node_modules/,  // 排除node_modules下的文件，其他文件都处理
                include: path.resolve(__dirname,"../src"),
                 use:[
                {
                    loader: 'thread-loader', // 开启多进程，注意特别耗时的时候用比较好 因为开启一个线程也需要时间
                    options:{
                        works: threads,

                    }
                },
                {
                 loader: 'babel-loader',
                options:{
                    // loader: 'babel-loader',
                    cacheDirectory: true, // 开启babel缓存
                    cacheCompression:false, // 关闭缓存的压缩
                     plugins: ["@babel/plugin-transform-runtime"]
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                }
            }
               ]
            }

            ],
        }
        ]
        },
    plugins:[
        new ESLINT_PLUGIN({
            // 检测哪些文件
               threads,
            context: path.resolve(__dirname,"../src")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"../public/index.html")
        })
    ],
     optimization:{
    minimizer:[
    // 压缩js
    new TerserWebpackPlugin({
            parallel:threads
        })
    ]
},
    devServer:{
        host:"localhost", // 启动服务器的地址
        port:"3080", // 启动服务器端口号
        open:true,// 是否自动打开浏览器
        hot: true //false 关闭热加载 但是js没有做到这一点
    },
    mode : 'development',
    devtool: 'cheap-module-source-map'
    }