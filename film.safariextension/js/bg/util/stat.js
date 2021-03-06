/**
 * 埋点处理
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    var CONFIG = require('../../config');
    var $ = require('jQuery');
    var UA = require('./ua');

    /**
     * url上添加ptag=film.extension.浏览器id
     * @param {[type]} url [description]
     */
    function addUrlStat(url) {
        var reg = /([^\?]*)(\?(.*))?/;

        if(url){
            url=url.replace(/[\?&#](ptag)=[^&#]+/gi,""); //去除自带的ptag
        }

        return url.replace(reg, function() {
            var args = arguments;
            var $1 = args[1],
                $3 = args[3];
            var param = 'film.extension.' + _getBrowserParam();

            return $1 + '?ptag=' + param + ($3 ? '&' + $3 : '');
        });
    }

    /**
     * 添加埋点监控
     */
    function addAEvent() {
        $(document).delegate('a', 'click', _aClickHandle);
    }

    /**
     * a标签点击处理
     * @return {[type]} [description]
     */
    function _aClickHandle() {
        var target = $(event.target);
        var url = target.attr('href');

        if (!url) {
            url = target.parents().attr('href');
            if (!url) {
                return true;
            }
        }
        console.log(addUrlStat(url));
        safari.application.activeBrowserWindow.openTab().url = addUrlStat(url);
        safari.extension.popovers[0].hide();
        return false;
    }

    /**
     * 得到浏览器埋点类型
     * 浏览器id类型（fox,360chrome,quickchrome,chrome）
     * @return {[type]} [description]
     */
    function _getBrowserParam() {
        var browser = CONFIG['browser'];
        var shell = browser || UA.shell;
        var key;

        switch (shell) {
            case 'chrome':
            case 'liebao':
            case 'sogou':
            case 'taobao':
            case 'baidu':
            case 'safari':
                key = shell;
                break;
            case '360':
                key = _mime("suffixes", "dll", "description", /fancy/) ? '360chrome' : 'quickchrome';
                break;
        }
        return key;
    }

    /**
     * 是否是新装插件
     * @return {Boolean} [description]
     */
    function _isInstall() {
        var isInstall = localStorage.getItem('install');

        if (!isInstall) {
            localStorage.setItem('install', 'true');
        }
        return !!isInstall;
    }

    //判断是否是360安全浏览器
    function _mime(where, value, name, nameReg) {
        var mimeTypes = navigator.mimeTypes,
            i;

        for (i in mimeTypes) {
            if (mimeTypes[i][where] == value) {
                if (nameReg.test(mimeTypes[i][name])) return true;
            }
        }
        return false;
    }

    module.exports = {
        addAEvent: addAEvent,
        addUrlStat: addUrlStat,
        getBrowser: _getBrowserParam
    };
});