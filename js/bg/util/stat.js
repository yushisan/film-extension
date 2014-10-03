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
     * url上添加埋点tb_lm_id=etaocj_浏览器id
     * @param {[type]} url [description]
     */
    function addUrlStat(url) {
        var reg = /([^\?]*)(\?(.*))?/;

        return url.replace(reg, function() {
            var args = arguments;
            var $1 = args[1],
                $3 = args[3];
            var param = 'tb_lm_id=etaocj_' + _getBrowserParam();
            var install = _isInstall() ? '' : ('&' + param + '_install');

            //是否是最新版本
            param = localStorage.getItem('newVersion') == CONFIG['version'] ? param + 'new' : param;

            return $1 + '?' + param + install + ($3 ? '&' + $3 : '');
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
        window.open(addUrlStat(url));
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
            case 'sougou':
            case 'taobao':
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