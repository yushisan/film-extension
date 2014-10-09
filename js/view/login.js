//seajs配置
seajs.config({
	base: "../js/sea-modules/",
	alias: {
		"jQuery": "jquery/jquery/1.10.1/jquery-debug.js"
	}
});
/**
 * 登录态
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
	var $ = require('jQuery'),

		module.exports = {
			/**
			 * 根据skey计算出hashcode
			 *
			 * @param {string}
			 *          skey
			 * @return {string}
			 */
			time33: function(skey) {
				// 哈希time33算法
				for (var i = 0, len = skey.length, hash = 5381; i < len; ++i) {
					hash += (hash << 5) + skey.charAt(i).charCodeAt();
				};
				return hash & 0x7fffffff;
			},

			/**
			 * 获取CSRF 的 token
			 *
			 * @return {String}
			 */
			getToken: function() {
				var skey = this.getSkey(),
					token = !!skey ? this.time33(skey) : "";
				return token;
			},

			/**
			 * 获取skey
			 * @return {}
			 */
			getSkey: function() {

				
				var skey = Live.string.trim(Live.cookie.get("skey")).replace(/(^\s*)|(\s*$)/g, "");
                return skey || Live.string.trim(Live.cookie.get("lskey"));
			},

			isLogin: function() {
				return (txv.login.getUin() > 10000);
			},

			/**
			 * 获得登录用户的QQ号码
			 *
			 * @return {Number}
			 */
			getUin: function() {
				if (txv.login.getSkey() == "") {
					return 0;
				}
				var uin = parseInt(Live.cookie.get(txv.login.config.uinCookie).replace(/^o0*/g, ""), 10);
				if (!uin || uin <= 10000) {
					uin = parseInt(Live.cookie.get(txv.login.config.luinCookie).replace(/^o0*/g, ""), 10);
					if (!uin || uin <= 10000) {
						return 0;
					}
				}
				return uin;
			},


		};

});