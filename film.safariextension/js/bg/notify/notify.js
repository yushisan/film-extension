/**
 * 消息展示
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    var CONFIG = require('../../config');
    var DbTheater = require('../db/theater');
    var DbTrailer = require('../db/trailer');
    var DbActivity = require('../db/activity');
    var Stat = require('../util/stat');
    var chrome = window.chrome || window.sogouExplorer; //chrome 或 sogou
    var $ = require('jQuery');

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
                } else {
                    self.setIconText();
                    DbTheater.select(CONFIG['msg_flag']['new'], function(data) {
                        if (data.length > 0) {
                            var num = data.length > 3 ? 3 : data.length;
                            for (var i = num - 1; i >= 0; i--) {
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
                            };

                        }
                        // 将所有的记录标记为已通知
                        DbTheater.markAllNotifyed();
                    }, 1);
                    // 查找最新的一条活动
                    DbActivity.select(CONFIG['msg_flag']['new'], function(data) {
                        if (data.length > 0) {
                            var num = data.length > 2 ? 2 : data.length;
                            for (var i = num - 1; i >= 0; i--) {
                                var item = data[i];
                                var msg = {
                                    id: item.id,
                                    title: item.title,
                                    text: item.desc,
                                    link: item.url,
                                    img: item.pic,
                                    type: 'activity'
                                };
                                self.showNotify(msg);
                            };
                        }
                        // 将所有的记录标记为已通知
                        DbActivity.markAllNotifyed();
                    }, 1);
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

            //console.log('----------------firstShowMessage');
            self.setIconText();
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

            setTimeout(function() {
                // 查找最新的1条
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
            }, 6 * 1000);


        },

        /**
         * 显示消息提醒
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
         */
        showNotify: function(msg) {
            var self = this;

            self.show({
                'id': msg.id,
                'img': msg.img,
                'pic': msg.img,
                'title': msg.title,
                'text': msg.text,
                'link': msg.link,
                'type': msg.type
            }, null, function() { //click back
                if (msg.type = 'theater') {
                    DbTheater.updateRead(msg.id, function() {
                        self.setIconText();
                    });
                } else if (msg.type = 'activity') {
                    DbActivity.updateRead(msg.id, function() {
                        self.setIconText();
                    });
                }
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
            var nid = msg.type + "_" + msg.id;

            var notification = new Notification(msg.title, {
                icon: msg.img,
                body: msg.text || ''
            });
            notification.onclick = function() { // 点击打开链接
                safari.application.activeBrowserWindow.openTab().url = Stat.addUrlStat(msg.link);
                //window.open(Stat.addUrlStat(msg.link));
                notification.close();
                clickBack && clickBack();
            };
            //notification.show();
            /*
            (function(n) {
                setTimeout(function() {
                    if (n.close) {
                        n.close();
                    }
                }, 15 * 1000);
            })(notification);
            */
            showBack && showBack();
        },

        /**
         * 设置icon上的text
         * @param {[type]} text [description]
         */
        setIconText: function() {
            //console.log('---------------setIconText');
            DbTheater.getUnReadCount(function(theatercount) {
                DbTrailer.getUnReadCount(function(trailercount) {
                    DbActivity.getUnReadCount(function(activitycount) {
                        var count = theatercount + trailercount + activitycount;
                        //console.log('---------------setIconText count:' + count);
                        if (count == 0) {
                            count = "";
                        }

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
            DbTrailer.updateReadAll();
            DbActivity.updateReadAll();

        }
    };

    module.exports = Notify;
});
