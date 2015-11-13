'use strict';

console.log('this is a.js...');

var b = require('./b');
var c = require('./c');
var d = require('./d');
var e = require('./e');

var a = {
	add: function(a, b) {
		return a + b;
	},
	mutil: function(a, b) {
		return a - b;
	}	
}

module.exports = a;