/**
 * 会员活动
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
		TB = require('../db/activity'),
		Activity = {};

	$.extend(true, Activity, Base, {

		attr: {
			tbClass: TB,

			url: Config['url']['activity'], //请求地址
			params: { //请求参数
			},
			dataType: 'text', //数据类型
			time: Config['timer']['activity_pull'],
			eveMax: 50, //每次入库最大条数
			max: 100 //库中数据最多条数
		},
		/**
		 * 拉数据回调
		 * @return {[type]} [description]
		 */
		pullBack:function(text){
			var mchs = text.match(/[\w]+\((.*)\)/);
			var result = JSON.parse(mchs && mchs[1] ? mchs[1] : {});

			this.toDb(result['list'], -1);
		},
		/**
		 * pull数据入库完成回调
		 * @return {[type]} [description]
		 */
		pullEnd:function(){
			$(document).trigger('dataPllEnd');
		},
		/**
		 * 构建json
		 * @return {[type]} [description]
		 */
		buildJson: function(item) {
			return {
				aid:item.aid,
				title:item.title,
				pic:item.pic,
				url:item.url,
				desc:item.desc,
				level:item.level,
				start:item.start,
				end:item.end,
				type:item.type
			};
		}

	});



	module.exports = Activity;

});