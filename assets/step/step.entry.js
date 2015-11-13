'use strict';

//css
require('./css/step.css');

var test = document.getElementById('test');

test.innerHTML = 'HELLO WORLD...';

//业务模块快要直接require
var a = require('./js/a');
console.log(a);

console.log(a.add(3, 4));

//公共组件 lib 下面的
var popup = require('../shared/popup/popup');
popup.init();



//公用模块
var $ = require('jquery'); // 这么引用 开发环境调试不报错
console.log($('body'));

//var aT = require('./template/a.handlebars');
//console.log(aT);
//
var _ = require('underscore');
console.log('_.VERSION: ' + _.VERSION);

var Backbone = require('backbone');

console.log(Backbone.VERSION);


console.log('_.VERSION: ' + _.VERSION);
console.log('test hot...');




