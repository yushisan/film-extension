define(function(require, exports, module) {
	var $ = require('jQuery');

	/**
	 * 滑动时间组件
	 */

	function SlideTime(obj) {
		var self = this;

		self.el = $(obj.el);
		self.isShow = obj.isShow || false;
		self.bTime = obj.bTime || 0;
		self.eTime = obj.eTime || 0;

		self._wid = self.el.width();
		self._eve = self._wid / 24;
		self._lPos = 0;
		self._rPos = 0;
		self._minPos = -12.5;
		self._maxPos = self._wid - 12.5;

		self._init();

	}
	SlideTime.prototype = {
		/**
		 * 显示
		 * @return {[type]} [description]
		 */
		show:function(){
			var self = this;

			self.el.show();
			self.isShow = true;
		},

		/**
		 * 隐藏
		 * @return {[type]} [description]
		 */
		hide:function(){
			var self = this;

			self.el.hide();
			self.isShow = false;
		},

		/**
		 * 初始化
		 * @return {[type]} [description]
		 */
		_init: function() {
			var self = this;

			self._initRend();
			self._addEvent();
		},

		/**
		 * 初始渲染
		 * @return {[type]} [description]
		 */
		_initRend:function(){
			var self = this,
				bTime = self.bTime,
				eTime = self.eTime;
			var left = self.el.find('.slide-left');
			var right = self.el.find('.slide-right');
			var timeNode = self.el.find('.time');

			if(!self.isShow){
				self.hide();				
			}
			self._lPos = bTime * self._eve - 12.5;
			self._rPos = eTime * self._eve - 12.5;

			left.css('left', self._lPos);
			right.css('left', self._rPos);
			self._rendBgWid();
			timeNode.html(self._formatTime(self.bTime) + '-' + self._formatTime(self.eTime));
		},

		/**
		 * 添加事件
		 */
		_addEvent: function() {
			var self = this,
				el = self.el,
				left = el.find('.slide-left'),
				right = el.find('.slide-right');

			self._dragEvent(left, 'left');
			self._dragEvent(right, 'right');
		},


		_dragEvent: function(el, direct) {
			var self = this,
				mX, rX;

			el.on('mousedown', function(ev) {
				var ths = $(this);
				var bPos = self._removePx(ths.css('left'));

				mX = ev.pageX;
				console.log('----------bpos:' + mX);

				self.el.find('.slide-left, .slide-right').css('z-index', 500);

				$(document).on('mousemove', function(ev) {

					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

					rX = ev.pageX - mX;
					ePos = bPos + rX;

					if (ePos < self._minPos) {
						ePos = self._minPos;
					} else if (ePos > self._maxPos) {
						ePos = self._maxPos;
					}

					switch (direct) {
						case 'left':
							if (ePos > self._rPos) {
								ePos = self._rPos;
							}
							self._lPos = ePos;
							break;
						case 'right':
							if (ePos < self._lPos) {
								ePos = self._lPos;
							}
							self._rPos = ePos;
							break;
					}
					ths.css({
						'left': ePos,
						'z-index': 501
					});
					self._rendBgWid();
					self._rendTime(ePos, direct);

				});
				$(document).on('mouseup', function() {
					$(document).off('mousemove');
					$(document).off('mouseup');
				});
			});
		},

		_rendTime: function(pos, direct) {
			var self = this;
			var timeNode = self.el.find('.time');
			var left = self.el.find('.slide-left');
			var right = self.el.find('.slide-right');
			var lKey = left.attr('for');
			var rKey = right.attr('for');
			var time = Math.floor((pos + 12.5) / self._eve);

			switch (direct) {
				case 'left':
					self.bTime = time;
					break;
				case 'right':
					self.eTime = time;
					break;
			}
			timeNode.html(self._formatTime(self.bTime) + '-' + self._formatTime(self.eTime));
			localStorage.setItem(lKey, self.bTime);
			localStorage.setItem(rKey, self.eTime);
		},

		_rendBgWid:function(){
			var self =this;
			var bg = self.el.find('.slide-bg-mid');

			bg.css({
				'left': self._lPos + 12.5,
				'width': self._rPos - self._lPos 
			});
		},

		/**
		 * 去掉px
		 * @param  {[type]} str [description]
		 * @return {[type]}     [description]
		 */
		_removePx: function(str) {
			return parseInt(str.substring(0, str.length - 2), 10);
		},

		_formatTime: function(hour) {
			hour = hour + '';
			return (hour.length > 1 ? hour : '0' + hour) + ':00';
		}
	};

	module.exports = SlideTime;
});