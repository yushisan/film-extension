/**
 * 院线新片
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
		Msg = require('../db/msg'),
		Theater = {};

	$.extend(true, Theater, Base, {

		attr: {
			tbClass: Msg,

			url: Config['url']['theater'], //请求地址
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
		pullBack:function(result){
			this.toDb(JSON.parse(result));
		},
		/**
		 * pull数据入库完成回调
		 * @return {[type]} [description]
		 */
		pullEnd:function(){
			$(document).trigger('todayPllEnd');
		},
		/**
		 * 构建json
		 * @return {[type]} [description]
		 */
		buildJson: function(item) {
			return {
				cid: item.cid,
				title: item.title,
				brief:item.brief,
				year:item.year,
				desc: item.desc,
				url:item.url,
				pic:item.pic,
				checkuptime:item.checkuptime,
				douban:item.douban,
				newscore:item.newscore,
				pay:item.pay
			};
		}

	});



	module.exports = Today;

});