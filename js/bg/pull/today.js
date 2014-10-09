/**
 * 今日推荐
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
		Today = {};

	$.extend(true, Today, Base, {

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
				title: item.title,
				pre_title: item.preTitle,
				sale_title: item.saleTitle,
				description: item.context,
				buy_link: item.link,
				etao_link: item.link,
				comment_link: item.link,
				author: 'etao',
				image_url: item.tfsPic,
				pub_date: new Date(item.onlineTime).getTime()
			};
		}

	});



	module.exports = Today;

});