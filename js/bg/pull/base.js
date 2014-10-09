/**
 * pull数据 基类
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
	var $ = require('jQuery');
	var ddd = new Date().getTime();

	var Base = {

		attr: {
			type: 'get',
			url: '', //请求地址
			params: { //请求参数
			},
			dataType: 'json', //数据类型
			time: 5 * 1000, //请求时间间隔
			eveMax: 50, //每次入库最大条数
			max: 100, //库中数据最多条数

			tbClass: null
		},

		_startBack: null, //启动完成回调

		/**
		 * 启动
		 * @return {[type]} [description]
		 */
		start: function(back) {
			var self = this;

			console.log(self.attr.url);

			self._startBack = back;
			self.pull();
		},

		/**
		 * 拉数据
		 * @return {[type]} [description]
		 */
		pull: function() {
			var self = this,
				attr = self.attr;

			$.ajax({
				type: attr.type,
				url: attr.url,
				data: attr.params,
				dataType: attr.dataType,
				success: function(result) {
					self.pullBack(result);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown){
			        console.log(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
			    }
			});
			console.log('定时 pull 数据:' + (new Date().getTime() - ddd));
			setTimeout(function() {
				self.pull();
			}, attr.time);
		},

		/**
		 * 拉数据回调
		 * @return {[type]} [description]
		 */
		pullBack: function(result) {
			this.toDb(result);
		},

		/**
		 * 入库
		 * @return {[type]} [description]
		 */
		toDb: function(data, order) {
			var self = this,
				TbClass = self.attr.tbClass;

			TbClass.inserts(data, function() {

				self._checkIsOverMax(function() {
					if (self._startBack) {
						self._startBack();
						self._startBack = null;
					}
					self.pullEnd && self.pullEnd();
				});
				TbClass.deleteMore && TbClass.deleteMore();
			}, order || 1);

		},

		_checkIsOverMax: function(back) {
			var MAX_COUNT = localStorage.getItem('max_notify_count'),
				self = this,
				TbClass = self.attr.tbClass,
				select = TbClass.selectAll || TbClass.select;

			select.call(TbClass, function(result) {
				var len = result.length,
					i = MAX_COUNT, //删除数据开始下标
					delNum = 0; //删除数据的条数

				if (len > MAX_COUNT) {
					for (; i < len; i++) {
						TbClass.delete(result[i].id, function() {
							if (++delNum == len - MAX_COUNT) {
								back();
							}
							console.log('---------delNum:' + delNum + '--------MAX_COUNT:' + len);
						});
					}
				} else {
					back();
				}
			});
		}

	};

	module.exports = Base;

});