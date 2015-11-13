'use strict';

var path = require('path');
var webpack = require('webpack');

var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var assetsPluginInstance = new AssetsPlugin({filename: 'assets/assets-map.json', update: true, prettyPrint: true});

var node_modules = path.join(__dirname, './node_modules');
var baseConfig = {
    cdn: 'http://127.0.0.1:9527/public/'
};

module.exports = {
	entry: {},
	output: {
        filename: "[name]-[chunkhash].js",
        chunkFilename: '[name]-[chunkhash].js',
        path: path.join(__dirname , 'public'),
        //webpack-dev-server build的文件是在内存里的，
        //使用时，在硬盘上看不到生成的文件。这个路径是静态文件的basePath
        publicPath: baseConfig.cdn || '/_build/' 
    },
    externals: { //externals对象的key是给require时用的，比如require('require')，
                //对象的value表示的是如何在global（即window）中访问到该对象，这里是window.jQuery
        jquery: 'jQuery',
        underscore: '_',
        backbone: 'Backbone'
    },
    resolve: {
        alias: {//alias作用是把用户的一个请求重定向到另一个路径，
               //这样待打包的脚本中的 require('jquery')就相当于require(xx/xx/jquery.js);
            jquery: path.join(node_modules, './jquery/dist/jquery.min.js'),
            underscore: path.join(node_modules, './underscore/underscore-min.js'),
            backbone: path.join(node_modules, '/backbone/backbone-min.js')
        }
    },
    resolveLoader: { //Like resolve but for loaders. 例如 style-loader，css-loader 是从node_modules 里面查找的
        root: path.join(__dirname, 'node_modules')
    },
    module: {
        noParse: [//noParse 如果确定一个模块中没有其它新的依赖 就可以配置这项，打包时webpack将不再扫描这个文件中的依赖。
            path.join(node_modules, './jquery/dist/jquery.min.js'),
            path.join(node_modules, './underscore/underscore-min.js')
        ],
        loaders: [
            {
                test: /[\.jsx|\.js ]$/,
                loader: "babel-loader?stage=0&optional[]=runtime"
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=10000&name=/img/[name]-[hash].[ext]'
            },
            {
                test: /\.(woff|eot|ttf)$/i,
                loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
            }
        ]
    },
    //devtool: 'sourcemap', //开发环境方便调试 会生成sourcemap，生产的时候可以去掉
    plugins: [
        new ExtractTextPlugin("[name]-[chunkhash].css"),
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['$', 'exports', 'require', 'Backbone', '_']
        //     }
        // }),
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            '_': 'underscore',
            'Backbone': 'backbone'
        }),
        assetsPluginInstance
    ]
};












