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
		TB = require('../db/theater'),
		Theater = {};

	$.extend(true, Theater, Base, {

		attr: {
			tbClass: TB,

			url: Config['url']['theater'], //请求地址
			params: { //请求参数
				_t:new Date().getTime()
			},
			dataType: 'text', //数据类型
			time: Config['timer']['theater_pull'],
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
			//this.toDb(JSON.parse(result));
		},
		/**
		 * pull数据入库完成回调
		 * @return {[type]} [description]
		 */
		pullEnd:function(){
			//$(document).trigger('dataPllEnd');
		},
		/**
		 * 构建json
		 * @return {[type]} [description]
		 */
		buildJson: function(item) {
			return {
				cid:item.cid,
				title:item.title,
				year:item.year,
				url:item.url,
				pic:item.pic,
				dir:item.dir,
				actor:item.actor,
				brief:item.brief,
				checkuptime:item.checkuptime,
				douban:item.douban,
				newscore:item.newscore,
				status:item.status
			};
		}

	});



	module.exports = Theater;

});