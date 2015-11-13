'use strict';

var path = require('path');
var glob = require('glob');
var _ = require('lodash');

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var proConfig = require('./webpack.base.config.js');


module.exports = function() {
    var config = _.merge({}, proConfig);
    
    config.entry = getEntryFiles();
    config = setWebpackHtmlPlugins(config);
    config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons-[chunkhash].js'
        })
    );
    return config;     
};

/**
 * get webpack entry values
 * @return {[type]} [description]
 */
function getEntryFiles() {
    var entries = {};
    var entryFiles = glob.sync('assets/**/*.entry.js');

    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var key = filePath.substring(filePath.lastIndexOf(path.sep)+1, filePath.lastIndexOf('.'));
        entries[key] = path.join(__dirname, filePath);
    }
    return entries;
}
/**
 * 添加多个 HTML文件
 * @param {[type]} conf [description]
 */
function setWebpackHtmlPlugins(conf) {
    _.each(conf.entry, function(val, key) {
        var filename = (key + '.html').replace('entry.', '');
        var template = val.substring(0, val.length-8) + 'html';

        conf.plugins.push(new HtmlWebpackPlugin({
            filename: filename,
            template: template,
            inject: true,
            chunks: [key, 'commons']
        }));
    });
    return conf;
}


