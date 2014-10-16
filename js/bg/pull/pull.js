/**
 * 拉数据初始 入口
 */

define(function(require, exports, module) {
	var $ = require('jQuery'),
		Theater = require('./theater'),
		Trailer = require('./trailer'),
		Activity = require('./activity'),
		Pull = {};


	Pull.start = function(back){

		Theater.start(function(){
			console.log('-------today pull end---');
				Trailer.start(function(){
					console.log('-------trailer pull end---');
					Activity.start(function(){
						console.log('-------activity pull end---');
						back && back();
					});
				});
		});

	};

	module.exports = Pull;

});