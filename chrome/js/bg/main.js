//seajs配置
seajs.config({
	base: "../js/sea-modules/",
	alias: {
		"jQuery": "jquery/jquery/1.10.1/jquery-debug.js"
	}
});

//作用当前main模块
seajs.use('../js/bg/main');

/**
 * 消息通知后台程序入口
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require) {
	var Db = require('./db/db'),
		Pull = require('./pull/pull'),
		Notify = require('./notify/notify');

		Db.init(function(){ //初始化db
			
			Pull.start(function(){ //启动定时拉数据
			});

			Notify.start(); //启动定时提醒
		});
});