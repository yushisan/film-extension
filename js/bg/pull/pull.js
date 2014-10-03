/**
 * 拉数据初始 入口
 */

define(function(require, exports, module) {
	var $ = require('jQuery'),
		Today = require('./today'),
		Low = require('./low'),
		Post9 = require('./post9'),
		Pull = {};


	Pull.start = function(back){

		Today.start(function(){
			console.log('-------today pull end---');

			// Low.start(function(){

				Post9.start(function(){
					console.log('-------low pull end---');
					back && back();
				});

			// });
		});

	};

	

	module.exports = Pull;

});