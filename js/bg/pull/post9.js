/**
 * 9块9包邮
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
	var
	Config = require('../../config'),
		$ = require('jQuery'),
		Base = require('./base'),
		Tb = require('../db/post9'),
		Post9 = {};

	$.extend(true, Post9, Base, {

		attr: {
			tbClass: Tb,

			url: Config['url']['post9'], //请求地址
			params: { //请求参数
			},
			dataType: 'text', //数据类型
			time: Config['timer']['post9_pull'],
			eveMax: 50, //每次入库最大条数
			max: 100 //库中数据最多条数
		},
		/**
		 * 拉数据回调
		 * @return {[type]} [description]
		 */
		pullBack: function(text) {
			var mchs = text.match(/[\w]+\((.*)\)/);
			var result = JSON.parse(mchs && mchs[1] ? mchs[1] : {});

			this.toDb(result['result']['itemResult'], -1);
		}
	});



	module.exports = Post9;

});