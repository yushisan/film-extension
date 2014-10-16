/**
 * 对messages表操作
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    var CONFIG = require('../../Config'),
        TB_VAR_NAME = 'activity',
        MSG_SQL = require('./sql')[TB_VAR_NAME],
        TB_NAME = MSG_SQL['name'],
        $ = require('jQuery'),
        Base = require('./base'),
        Activity = {};

    var ddd = new Date().getTime();


    Activity.super = Base;
    $.extend(true, Activity, Base, {
        tb: TB_VAR_NAME,
        /**
         * 创建表
         */
        create: function(back) {
            var self = this;

            this.super.create.call(this, function() {
                back && back();
            });
        },

        formatInsert: function(item) {
            return {
                checkFields: [
                    item.title
                ],
                insertFields: [
                    (item['title'] || '').replace(/"/g, '&quot;').replace(/'/g, '&apos;'),
                    item['pic'],
                    item['url'],
                    (item['desc'] || '').replace(/"/g, '&quot;').replace(/'/g, '&apos;'),
                    item['level'],
                    item['start'],
                    item['end'],
                    item['type'],
                    0,
                    0
                ]
            };
        },

        /**
         * 查询msg表数据
         * @param status
         * @param callback
         * @param size
         */
        select: function(status, callback, size) {
            size = size || 400;

            this.executeSql(MSG_SQL['select_messages'], [
                TB_NAME,
                status,
                size
            ], function(rs) {
                var result_array = [];
                for (var i = 0; i < rs.rows.length; i++) {
                    result_array.push(rs.rows.item(i));
                }
                callback(result_array);
            });
        },
        /**
         * 查询msg表所有数据
         * @param callback
         */
        selectAll: function(callback, size) {
            size = size || 400;

            this.executeSql(MSG_SQL['select_all_messages'], [
                TB_NAME,
                size
            ], function(rs) {
                var result_array = [];
                for (var i = 0; i < rs.rows.length; i++) {
                    result_array.push(rs.rows.item(i));
                }
                callback(result_array);
            });
        },
        /**
         * 得到未读消息
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        getUnReadCount: function(callback) {
            this.executeSql(MSG_SQL['unread'], [
                TB_NAME
            ], function(rs) {
                callback && callback(rs.rows.item(0).unseen_count);
            });
        },
        /**
         * 设置为已读
         * @param  {[type]}   msg_id   [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        updateRead: function(msg_id, callback) {

            this.executeSql(MSG_SQL['update_read'], [
                TB_NAME,
                1,
                msg_id
            ], function() {
                callback && callback();
            });

        },
        /**
         * 设置所有消息为已读
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        updateReadAll: function(callback) {

            this.executeSql(MSG_SQL['update_read_all'], [
                TB_NAME
            ], function() {
                callback && callback();
            });

        },
        /**
         * 更新消息状态(是否已提醒)
         * @param msg_id
         * @param status
         * @param callback
         */
        updateStatus: function(msg_id, status, callback) {
            console.log('-------------updateStatusMsg');
            this.executeSql(MSG_SQL['update_messages'], [
                TB_NAME,
                status,
                msg_id
            ], function() {
                callback && callback();
            });
        },

        /**
         * 把所有消息标记为已通知
         */
        markAllNotifyed: function(callback) {
            this.executeSql(MSG_SQL['mark_all_readed_messages'], [
                TB_NAME,
                CONFIG['msg_ty']['nodifyed']
            ], function() {
                callback && callback();
            });
        },
        /**
         * 删除比当前时间晚的数据(临时解决预发数据上线bug)
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        deleteMore:function(callback){
            this.executeSql(MSG_SQL['delete_more'], [
                TB_NAME,
                new Date().getTime() + 5000
            ], function() {
                callback && callback();
            });
        },
        /**
         * 删除msg表
         */
        drop: function(callback) {
            this.executeSql(MSG_SQL['drop_table'], [
                TB_NAME
            ], function() {
                callback && callback();
            });
        }

    });

    window.Activity = Activity;
    module.exports = Activity;

});