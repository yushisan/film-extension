/**
 * 消息展示
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
	var CONFIG = require('../../config');
	var DbTheater = require('../db/theater');
	var DbActivity = require('../db/activity');
	var Stat = require('../util/stat');
	var chrome = window.chrome || window.sogouExplorer; //chrome 或 sougou
	var $ = require('jQuery');
	var Local = require('../local/local');
	
	var Notify = {

		firstMsg: true,

		/**
		 * 启动消息展示控制
		 * @return {[type]} [description]
		 */
		start: function() {
			var self = this;

			$(document).on('dataPllEnd', function() {
				if (self.firstMsg) {
					self.firstMsg = false;
					self.firstShowMsg();
					self.checkVersion();
				} else {
					self.setIconText();
					DbTheater.select(CONFIG['msg_flag']['new'], function(data) {
						if (data.length > 0) {
							var item = data[0];
							var msg = {
								id: item.id,
								title: item.title,
								text: item.brief,
								link: item.url,
								img: item.pic,
								type: 'theater'
							};
							self.showNotify(msg);
						}
						// 将所有的记录标记为已通知
						DbTheater.markAllNotifyed();
					}, 1);
					// 查找最新的一条活动
					DbActivity.select(CONFIG['msg_flag']['new'], function(data) {
						if (data.length > 0) {
							var item = data[0];
							var msg = {
								id: item.id,
								title: item.title,
								text: item.desc,
								link: item.url,
								img: item.pic,
								type: 'activity'
							};
							self.showNotify(msg);
						}
						// 将所有的记录标记为已通知
						DbActivity.markAllNotifyed();
					}, 1);
				}
			});
		},

		/**
		 * 检查版本
		 * @return {[type]} [description]
		 */
		checkVersion: function() {
			var self = this;
			//TODO:检测新版本
		},

		/**
		 * 每次加载插件后，第一次展示消息
		 * @return {[type]} [description]
		 */
		firstShowMsg: function() {
			var self = this,
				i = 0;

			console.log('----------------firstShowMessage');
			self.setIconText();
			// 查找最新的2条
			DbTheater.select(CONFIG['msg_flag']['new'], function(data) {
				if (data.length > 0) {
					// 展示最新的三条记录
					function _show(i) {
						i = i || 0;
						var item = data[i];
						var msg = {
							id: item.id,
							title: item.title,
							text: item.brief,
							link: item.url,
							img: item.pic,
							type: 'theater'
						};
						self.showNotify(msg);
						i++;
						if (i >= 2) {
							return;
						}
						setTimeout(function() {
							_show(i);
						}, 500);
					}
					_show();
				}
				// 将所有的记录标记为已通知
				DbTheater.markAllNotifyed();

				// 查找最新的1条活动
				DbActivity.select(CONFIG['msg_flag']['new'], function(data) {
					if (data.length > 0) {
						var item = data[0];
						var msg = {
							id: item.id,
							title: item.title,
							text: item.desc,
							link: item.url,
							img: item.pic,
							type: 'activity'
						};
						self.showNotify(msg);
					}
					// 将所有的记录标记为已通知
					DbActivity.markAllNotifyed();
				}, 1);
			}, 2);
		},

		/**
		 * 显示消息提醒
		 * @param  {[type]} msg [description]
		 * @return {[type]}     [description]
		 */
		showNotify: function(msg) {
			var self = this;
			self.convertImgToBase64(msg.img, function(base64Img){
				self.show({
					'img':base64Img,
					'title': msg.title,
					'text': msg.text,
					'link': msg.link
				}, null, function() { //click back
					if (msg.type = 'theater') {
						DbTheater.updateRead(msg.id, function() {
							self.setIconText();
						});
					}else if (msg.type = 'activity') {
						DbActivity.updateRead(msg.id, function() {
							self.setIconText();
						});
					}
				});
			});
		},

		/**
		 * 弹出消息通知
		 * @param  {[type]} msg       [消息数据]
		 * @param  {[type]} showBack  [消息展示时回调]
		 * @param  {[type]} clickBack [点击消息时回调]
		 * @return {[type]}           [description]
		 */
		show: function(msg, showBack, clickBack) {
			var self = this;

			if (localStorage.getItem('is_notify_desk') == 'off') {
				return;
			}
			// 如果设置安静时间，进行判断。在安静时间内不发提醒
			if (localStorage.getItem('is_notify_quiet') == 'on') {
				var currentTime = new Date();
				var quiet_time_begin = localStorage.getItem('quiet_time_b');
				var quiet_time_end = localStorage.getItem('quiet_time_e');
				if (currentTime.getHours() >= quiet_time_begin && currentTime.getHours() < quiet_time_end) {
					return;
				}
			}

				var notification =new Notification(msg.title, {
						    icon: msg.img,
						    body: msg.text || ''
						  });
				notification.onclick = function() { // 点击打开链接
					window.open(Stat.addUrlStat(msg.link));
					notification.close();
					clickBack && clickBack();
				};
				//notification.show();
				(function(n) {
					setTimeout(function() {
				    if (n.close) {
							n.close();
						}
					}, localStorage.getItem('desk_stop_time') * 1000);
				})(notification);

				showBack && showBack();
			// } else {
			// 	window.webkitNotifications.requestPermission();
			// }
		},

		/**
		 * 设置icon上的text
		 * @param {[type]} text [description]
		 */
		setIconText: function() {
			console.log('---------------setIconText');
			DbTheater.getUnReadCount(function(theatercount) {
				DbActivity.getUnReadCount(function(activitycount) {
					var count=theatercount+activitycount;
					console.log('---------------setIconText count:' + count);
					if (count == 0) {
						count = "";
					}
					chrome.browserAction.setBadgeText({
						text: String(count)
					});
				});
			});
		},

		/**
		 * 清除icon上的text
		 * @return {[type]} [description]
		 */
		clearIconText: function() {
			DbTheater.updateReadAll();
			chrome.browserAction.setBadgeText({
				text: ""
			});
		},
		/**
		*图片转为Base64并修改大小
		*/
		convertImgToBase64: function(src, callback) {
			// 创建一个 Image 对象
			var image = new Image();
			image.crossOrigin = "*";
			// 绑定 load 事件处理器，加载完成后执行
			image.onload = function() {
				// 获取 canvas DOM 对象
				var canvas = document.createElement('canvas');
				image.width = 80;
				image.height = 80;
				// 获取 canvas的 2d 环境对象,
				// 可以理解Context是管理员，canvas是房子
				var ctx = canvas.getContext("2d");
				// 重置canvas宽高
				canvas.width = image.width;
				canvas.height = image.height;
				// 将图像绘制到canvas上
				ctx.drawImage(image, 0, 0, image.width, image.height);
				var dataURL = canvas.toDataURL('image/jpeg');
				callback.call(this, dataURL);
				// Clean up 
				canvas = null;
			};
			// 设置src属性，浏览器会自动加载。
			// 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
			image.src = src;
		}
	};

	module.exports = Notify;
});