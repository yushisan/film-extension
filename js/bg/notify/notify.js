/**
 * 消息展示
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
	var CONFIG = require('../../config');
	var DbMsg = require('../db/msg');
	var DbPost = require('../db/post9');
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

			$(document).on('todayPllEnd', function() {
				if (self.firstMsg) {
					self.firstMsg = false;
					self.firstShowMsg();
					self.checkVersion();
				} else {
					self.setIconText();
					DbMsg.select(CONFIG['msg_ty']['new'], function(data) {
						data.length > 0 && self.showToday(data[0]);

						// 将所有的记录标记为已通知
						DbMsg.markAllNotifyed();
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

			$.ajax({
				type: 'post',
				url: 'http://www.taobao.com/go/rgn/etao/etao_notify.php',
				dataType: 'json',
				success: function(result) {
					var newV = +result.version.split('.').join('');
					var curV = +CONFIG['version'].split('.').join('');
					var browser;
					var link;

					Local.set('newVersion', result.version);
					if (newV > curV) {
						browser = Stat.getBrowser();
						switch (browser) {
							case 'chrome':
							case 'taobao':
							case 'liebao':
								link = '';
								break;
							case '360chrome':
							case 'quickchrome':
								link = 'http://www.etao.com/etao_notify_360.crx?file=etao_notify_360.crx';
								break;
							case 'sougou':
								link = '';
								break;
						}
						setTimeout(function() {
							self.show({
								title: '版本更新',
								text: '温馨提示：您的一淘优惠提醒插件有了新版本，' + result.version + '，请及时更新哦！',
								img: chrome.extension.getURL('/img/icon_80x80.png'),
								link: link
							});
						}, 5000);
					}
				}
			});
		},

		/**
		 * 每次加载插件后，第一次展示消息
		 * @return {[type]} [description]
		 */
		firstShowMsg: function() {
			var self = this,
				i = 0;

			console.log('----------------firstLoginShowMessage');
			self.setIconText();
			// 查找最新的三条
			DbMsg.select(CONFIG['msg_ty']['new'], function(data) {
				if (data.length > 0) {
					// 展示最新的三条记录
					function _show(i) {
						i = i || 0;
						self.showToday(data[i]);
						i++;
						if (i >= 3) {
							return;
						}
						setTimeout(function() {
							_show(i);
						}, 500);
					}
					_show();
				}
				// 将所有的记录标记为已通知
				DbMsg.markAllNotifyed();
			}, 3);
		},

		/**
		 * 今日推荐消息提醒
		 * @param  {[type]} msg [description]
		 * @return {[type]}     [description]
		 */
		showToday: function(msg) {
			var self = this;

			self.show({
				'img': msg['image_url'] + '_80x80',
				'title': ('【一淘推荐】' + msg.title).replace(/(【一淘推荐)】【(.*】.*)/, '$1 $2'),
				'htmlText': ('【一淘推荐】' + msg['pre_title']).replace(/(【一淘推荐)】【(.*】.*)/, '$1 $2') + '<strong class="item-title-em">' + msg['sale_title'] + '</strong>',
				'link': msg.buy_link
			}, null, function() { //click back
				DbMsg.updateSeen(msg.id, function() {
					self.setIconText();
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

			var webkitNotify = window.webkitNotifications,
				notification = null;
			var havePermission = webkitNotify.checkPermission();

			// if (havePermission == 0) {

				if (typeof webkitNotifications.createHTMLNotification == "function") {
					var msgs = Local.get('msgs');
					var msgArr = msgs ? JSON.parse(msgs) : [];

					// if(self.firstMsg){
					// 	msgArr = [];
					// 	self.firstMsg = false;
					// }
					msgArr.push(msg);
					Local.set('msgs', JSON.stringify(msgArr));
					notification = webkitNotify.createHTMLNotification(chrome.extension.getURL("/app/notify2.html"));
				} else {
					notification = webkitNotify.createNotification(msg.img, msg.title, msg.text || '');
				}
				// notification.onshow = function() { // 30秒后自动关闭
				// 	setTimeout(function() {
				// 		notification.close();
				// 	}, localStorage.getItem('desk_stop_time') * 1000);
				// 	showBack && showBack();
				// };
				notification.onclick = function() { // 点击打开链接
					window.open(Stat.addUrlStat(msg.link));
					if (notification.cancel) {
						notification.cancel();
					} else if (notification.close) {
						notification.close();
					}
					clickBack && clickBack();
				};
				notification.show();
				(function(n) {
					setTimeout(function() {
						if (n.cancel) {
							n.cancel();
						} else if (n.close) {
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

			DbMsg.getUnSeenCount(function(count) {

				console.log('---------------setIconText count:' + count);
				if (count == 0) {
					count = "";
				}
				chrome.browserAction.setBadgeText({
					text: String(count)
				});
			});
		},

		/**
		 * 得到icon上的count数
		 * @param  {[type]} back [description]
		 * @return {[type]}      [description]
		 */
		getIconCount: function(back) {
			DbMsg.getUnSeenCount(function(count) {
				back(count);
			});
		},

		/**
		 * 清除icon上的text
		 * @return {[type]} [description]
		 */
		clearIconText: function() {
			DbMsg.updateSeenAll();
			chrome.browserAction.setBadgeText({
				text: ""
			});
		}
	};

	module.exports = Notify;
});