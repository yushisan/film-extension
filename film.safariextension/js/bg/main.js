//seajs配置
seajs.config({
    base: "../js/sea-modules/",
    alias: {
        "jQuery": "jquery/jquery/1.10.1/jquery-debug.js"
    }
});

//作用当前main模块
seajs.use('../js/bg/main');

/**
 * 消息通知后台程序入口
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require) {
    function getCookies(cookies) {
        var uin = "";
        if (readCookie(cookies, "luin")) {
            uin = readCookie(cookies, "luin").replace(/^o0*/g, "");
        } else if (readCookie(cookies, "uin")) {
            uin = readCookie(cookies, "uin").replace(/^o0*/g, "");
        }
        if (!!uin) {
            var o_uin = localStorage.getItem('luin');
            if (o_uin) {
                if (uin != o_uin) {
                    localStorage.clear();
                    localStorage.setItem('luin', uin);
                    localStorage.setItem('uin', uin);
                }
            } else {
                localStorage.setItem('luin', uin);
                localStorage.setItem('uin', uin);
            }
        }
        if (readCookie(cookies, "lskey")) {
            localStorage.setItem('lskey', readCookie(cookies, "lskey"));
        }
        if (readCookie(cookies, "skey")) {
            localStorage.setItem('skey', readCookie(cookies, "skey"));
        }
    }

    function readCookie(cookies, name) {
        if (cookies) {
            var nameEQ = name + "=";
            var ca = cookies.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
    }

    function messageHandler(incMsg) {
        if (incMsg.name = "cookies") {
            getCookies(incMsg.message);
        }
    }

    safari.application.addEventListener("message", messageHandler, false);
    var Db = require('./db/db'),
        Pull = require('./pull/pull'),
        Notify = require('./notify/notify');

    Db.init(function() { //初始化db

        Pull.start(function() { //启动定时拉数据
        });

        Notify.start(); //启动定时提醒
    });
});
