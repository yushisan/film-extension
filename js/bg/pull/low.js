/**
 * 品牌最低价
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
		Tb = require('../db/low'),
		Low = {};

	$.extend(true, Low, Base, {

		attr: {
			tbClass: Tb,

			url: Config['url']['low'], //请求地址
			params: { //请求参数
			},
			dataType: 'text', //数据类型
			time: Config['timer']['today_pull'],
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

			this.toDb(result['result']['itemTotalNumResult'], -1);
		}

	});



	module.exports = Low;

});