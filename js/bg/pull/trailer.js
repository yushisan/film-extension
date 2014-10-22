/**
 * 即将上映
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
		Tb = require('../db/trailer'),
		Trailer = {};

	$.extend(true, Trailer, Base, {

		attr: {
			tbClass: Tb,

			url: Config['url']['trailer'], //请求地址
			params: { //请求参数
				_t:new Date().getTime()
			},
			dataType: 'text', //数据类型
			time: Config['timer']['trailer_pull'],
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

			this.toDb(result['list'], -1);
		}
	});



	module.exports = Trailer;

});