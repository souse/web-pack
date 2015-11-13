'use strict';

var path = require('path');
var glob = require('glob');
var _ = require('lodash');

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var htmlmin = require('gulp-htmlmin');
var sourcemaps = require('gulp-sourcemaps');

var webpack = require('webpack');
var webpackBaseConfig = require('./webpack.base.config.js');
var webpackConfig = require('./webpack.pro.config.js');

// 全局部分的文件
var libPath = {
    scripts: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/underscore/underscore.js',
        './node_modules/backbone/backbone.js'
    ]
};

/** clean the build file */
gulp.task('clean',function(){
    return gulp.src(['public', 'assets/assets-map.json'], {read: false})
        .pipe(clean());
});

/** 打包外部 lib 文件 非common */
gulp.task('lib', ['clean'], function (callback) {
    return gulp.src(libPath.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('lib-XXXXXXXXXX.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public'));

	/**webpack(webpackLibConfig, function (err, stats) {
		if(err) { throw new gutil.PluginError('webpack-lib', err); }
        if(typeof callback == 'function') { callback(); }
	});**/	
});

gulp.task('pack', ['lib'], function (callback) {
	webpack(webpackConfig(), function (err, stats) {
		if(err) { throw new gutil.PluginError('webpack-build', err); }
        if(typeof callback == 'function') { callback(); }
	});	
});

var htmlMinOption = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: false,//压缩HTML
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

// html process
gulp.task('default', ['pack'], function() {
    return gulp.src('public/*.html')
        .pipe(replace(/<script(.+)?data-debug([^>]+)?><\/script>/g, ''))
        .pipe(replace(/<link(.+)?data-debug([^>]+)?>/g, ''))
        .pipe(htmlmin(htmlMinOption))
        .pipe(gulp.dest('public'));
});



/** ===================== develop config  ============= **/
var WebpackDevServer = require('webpack-dev-server');
var getDevelopConfig = require('./webpack.dev.config.js');

gulp.task('dev-server', function(){
    var argv = require('yargs').argv;
    var folder = argv['f'];

    var entryFiles, port = 9527;
    var webpackDevConfig = getDevelopConfig();

    if(!folder){ folder = '**'; }
    entryFiles = glob.sync(__dirname + '/assets/' + folder + '/*.entry.js');
    if(entryFiles.length == 0){ throw new Error('can not find *.entry.js in folder:' + folder); }

    for(var i in entryFiles){
        var filePath = entryFiles[i];
        var key = filePath.substring(filePath.lastIndexOf(path.sep)+1, filePath.lastIndexOf('.'));
        
        webpackDevConfig.entry[key] = [
            'webpack-dev-server/client?http://0.0.0.0:' + port,
            'webpack/hot/dev-server',
            filePath
        ];
    }
    new WebpackDevServer(webpack(webpackDevConfig), {
        publicPath: webpackDevConfig.output.publicPath,
        hot: true,
        inline: true,
        stats: {
            colors:true
        }
    }).listen(port, 'localhost',function (err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);
    })
});


















