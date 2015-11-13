var webpack = require('webpack')
var path = require('path')

function getDevelopWebpack(){
    return {
        entry: {},
        output: {
            filename: "[name].js",
            chunkFilename: '[name].js',
            path:  path.resolve('_build'),
            sourceMapFilename: '[name].map',
            publicPath: '/_build/'//webpack-dev-server 文件是在内存里的，使用时，在硬盘上看不到生成的文件。这个路径是静态文件的basePath
        },
        module: {
            loaders: [
                { test: /\.css$/, loader: "style!css" },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: 'url?limit=10000&name=img/[name]-[hash].[ext]'
                },
                {
                    test: /\.(woff|eot|ttf)$/i,
                    loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
                }
            ]
        },
        devtool: 'source-map',
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    }
}
module.exports = getDevelopWebpack;



