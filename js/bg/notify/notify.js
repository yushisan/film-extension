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
                            var num=data.length>3?3:data.length;
                            for (var i =num - 1; i >= 0; i--) {
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
                            var num=data.length>2?2:data.length;
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
        },

        /**
         * 显示消息提醒
         * @param  {[type]} msg [description]
         * @return {[type]}     [description]
         */
        showNotify: function(msg) {
            var self = this;
            self.convertImgToBase64(msg.img, function(base64Img) {
                self.show({
                    'img': base64Img,
                    'title': msg.title,
                    'text': msg.text,
                    'link': msg.link
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
            var notification = new Notification(msg.title, {
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
                }, 15 * 1000);
            })(notification);

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
                        chrome.browserAction.setBadgeText({
                            text: String(count)
                        });
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
