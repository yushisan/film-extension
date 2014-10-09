/**
 * 拉数据初始 入口
 */

define(function(require, exports, module) {
	var $ = require('jQuery'),
		Today = require('./today'),
		Trailer = require('./trailer'),
		Pull = {};


	Pull.start = function(back){

		Today.start(function(){
			console.log('-------today pull end---');
				Trailer.start(function(){
					console.log('-------trailer pull end---');
					back && back();
				});
		});

	};

	module.exports = Pull;

});