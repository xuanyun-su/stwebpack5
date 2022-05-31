const path = require("path")
const ESLINT_PLUGIN = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin =  require('mini-css-extract-plugin')
const CssMinmizePlugin = require("css-minimizer-webpack-plugin")
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
        }),
        new MiniCssExtractPlugin({
            filename:"static/css/main.css"
        }),
        new CssMinmizePlugin(),
    ],
    devServer:{
        host:"localhost",
        port:"3080",
        open:true
    },
    mode : 'production',
    devtool: 'source-map'
    }