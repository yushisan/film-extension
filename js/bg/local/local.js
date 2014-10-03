/**
 * 本地存储
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    var Local = {};

    Local = {

        /**
         * 设置本地存储
         * @param {[type]} key [description]
         * @param {[type]} val [description]
         */
        set: function(key, val) {
            console.log(key + ' -> ' + val);
            localStorage.setItem(key, val);
        },

        /**
         * 读取本地存储
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
        get: function(key) {
            return localStorage.getItem(key);
        },

        /**
         * 初始化本地存储
         * @return {[type]} [description]
         */
        init: function(){
            var self = this;

            if (!self.get('desk_stop_time')) {
                self.set('desk_stop_time', 15);
                self.set('is_notify_desk', 'on');
                self.set('is_notify_quiet', 'off');
                self.set('max_notify_count', '100');
            }
        }

    };
    
    module.exports = Local;

});