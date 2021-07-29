const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const scssPath = path.resolve(__dirname, 'application/bootstrap.scss')
const jsPath = path.resolve(__dirname, 'application/bootstrap.js')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
    mode: dev ? 'development' : 'production',
    devtool: dev ? 'source-map' : false,
    entry: {
        main: [jsPath, scssPath]
    },
    output: {
        path: path.resolve(__dirname, 'httpdocs'),
        filename: 'javascript/build/app.js'
    },
    plugins:[new MiniCssExtractPlugin({
        filename: 'css/build/app.css'
    })],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env']
                        ]
                    }
                }
                
            },
            {
                test: /.\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require("sass"),
                            sassOptions: {
                                fiber: require("fibers"),
                            }
                        }
                    }, 
                    {
                        loader: 'postcss-loader',
                        options: {
                            presets: [
                                ['postcss-preset-env']
                            ]
                        }
                    }
                ],
            }
        ]
    } 
}