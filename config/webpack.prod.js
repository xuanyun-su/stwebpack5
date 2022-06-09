const os = require('os')
const path = require("path")
const ESLINT_PLUGIN = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin =  require('mini-css-extract-plugin')
const CssMinmizePlugin = require("css-minimizer-webpack-plugin")
const threads = os.cpus().length // cpu核数
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
function getStyleLoader(pre){
    return [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env"
                                ]
                            }
                        }
                    },
                    pre
                ].filter(Boolean)
}
module.exports = {
    entry:"./src/main.js",
    output:{
        path:path.resolve(__dirname,"../dist"),
        // 入口文件打包输出文件名
        filename:"static/js/[name].js",
        // 给打包输出的其他文件命名
        chunkFilename:'static/js/[name].chunk.js',
        // 图片，字体等通过type:asset处理资源命名方式
        assetModuleFilename: "static/media/[hash:10][ext][query]",
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
                include: path.resolve(__dirname,"../src"),
                // exclude: /node_modules/,
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
            threads,
            cache:true,
            cacheLocation: path.resolve(__dirname,"../node_modules/.cache/eslintcache"),
            // 检测哪些文件
            context: path.resolve(__dirname,"../src")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,"../public/index.html")
        }),
        new MiniCssExtractPlugin({
            filename:"static/css/[name].css",
            chunkFilename: "static/css/[name].chunk.css",
        }),
        new CssMinmizePlugin(),
        // new TerserWebpackPlugin({
        //     parallel:threads
        // })

    ],
    optimization:{
    minimizer:[
    // 压缩js
    new TerserWebpackPlugin({
            parallel:threads
        }),
      new ImageMinimizerPlugin({
            minimizer:{
                implementation: ImageMinimizerPlugin.imageminGenerate,
                options:{
                    plugins:[
                    ['gifsicle',{interlaced:true}],
                    ['jpegtran',{progressive: true},
                    ['optipng'],{opyimizationLevel:5}],
                    [
                    "svgo",
                    {
                        plugins:[
                        "preset-default",
                        'prefixIds',
                        {
                            name: " sortAttrs",
                            params:{
                                xminsOrder:'alphabetical',
                            }
                        }
                        ]
                    }
                    ]
                    ]
                }
            }
        })
    ],
    // 代码分割操作
    splitChunks: {
        chunks: "all",
        // 其他的都用默认值就好
    },
    // runtimeChunk: {
    //     name: entrypoint => `runtime~${entrypoint.name}.js`
    // }
},
    devServer:{
        host:"localhost",
        port:"3080",
        open:true
    },
    mode : 'production',
    devtool: 'source-map'
    }