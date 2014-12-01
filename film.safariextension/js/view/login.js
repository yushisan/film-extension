//seajs配置
/*
seajs.config({
	base: "../js/sea-modules/",
	alias: {
		"jQuery": "jquery/jquery/1.10.1/jquery-debug.js"
	}
});
*/
/**
 * 登录态
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    //var $ = require('jQuery'),

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
        getToken: function(callback) {
            var obj = this;
            this.getSkey(function(skey) {
                var token = !!skey ? obj.time33(skey) : "";
                if (callback) {
                    callback(token);
                };
            });
        },

        /**
         * 获取skey
         * @return {}
         */
        getSkey: function(callback) {
            var obj = this;
            obj.getCookie("skey", function(skey) {
                var skey = skey.replace(/(^\s*)|(\s*$)/g, "");
                if (!skey) {
                    obj.getCookie("lskey", function(lskey) {
                        callback(lskey);
                    });
                } else {
                    if (callback) {
                        callback(skey);
                    }
                }
            });
        },

        isLogin: function(callback) {
            this.getUin(function(uin) {
                callback && callback(uin > 10000)
            });
        },

        /**
         * 获得登录用户的QQ号码
         *
         * @return {Number}
         */
        getUin: function(callback) {
            var obj = this;
            this.getSkey(function(skey) {
                if (skey == "") {
                    callback && callback(0);
                } else {
                    obj.getCookie("uin", function(suin) {
                        var uin = parseInt(suin.replace(/^o0*/g, ""), 10);
                        if (!uin || uin <= 10000) {
                            obj.getCookie("luin", function(sluin) {
                                uin = parseInt(sluin.replace(/^o0*/g, ""), 10);
                                if (!uin || uin <= 10000) {
                                    uin = 0;
                                }
                                callback && callback(uin);
                            });
                        } else {
                            callback && callback(uin);
                        }
                    });
                }
            });
        },

        getCookie: function(name, callback, domain) {
            var value = '';
            if (localStorage.getItem(name)) {
                value = localStorage.getItem(name);
            }

            if (callback) {
                callback(value);
            }
        }
    };

});
