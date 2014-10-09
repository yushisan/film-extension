/**
 * 对low表操作
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    var CONFIG = require('../../Config');
     var   TB_VAR_NAME = 'trailer';
      var  TB_SQL = require('./sql')[TB_VAR_NAME];
     console.log(TB_SQL);
     var   TB_NAME = TB_SQL['name'],
        $ = require('jQuery'),
        Base = require('./base'),
        Trailer = {};


    var ddd = new Date().getTime();


    Trailer.super = Base;
    $.extend(true, Trailer, Base, {
        tb: TB_VAR_NAME,

        /**
         * 创建表
         */
        create: function(back) {
            this.super.create.call(this, function() {
                back && back();
            });
        },

        formatInsert: function(item) {
            return {
                checkFields: [
                    item.cid
                ],
                insertFields: [
                    item.cid,
                    item.title.replace(/"/g, '&quot;').replace(/'/g, '&apos;'),
                    item.url,
                    item.pic,
                    item.desc.replace(/"/g, '&quot;').replace(/'/g, '&apos;'),
                    item.checkuptime,
                    0
                ]
            };
        },

        /**
         * 查询表数据
         * @param status
         * @param callback
         * @param size
         */
        select: function(callback, size) {
            size = size || 400;

            this.executeSql(TB_SQL['select'], [
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
         * 得到未读信息条数
         * @param  {[type]} back [description]
         * @return {[type]}      [description]
         */
        getUnReadCount: function(back) {
            this.executeSql(TB_SQL['unread'], [
                TB_NAME
            ], function(rs) {

                back && back(rs.rows.item(0).un_read);
            });
        },

        /**
         * 所有数据标记为已读
         * @return {[type]} [description]
         */
        updateReadAll: function(back) {
            this.executeSql(TB_SQL['update_read'], [
                TB_NAME
            ], function(rs) {
                back && back();
            });
        }

        
    });

    window.Trailer = Trailer;
    module.exports = Trailer;

});