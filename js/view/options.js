/**
 * Detail:
 * User: wb-wangling
 * Date: 13-9-4
 * Time: 上午10:28
 */
//seajs配置
seajs.config({
    base: "../js/sea-modules/",
    alias: {
        "jQuery": "jquery/jquery/1.10.1/jquery-debug.js",
        "bs": "bootstrap/3.03/bootstrap.js"
    }
});

//作用当前main模块
seajs.use('../js/view/options');


define(function(require, exports, module) {
    var CONFIG = require('../config'),
        $ = require('jQuery'),
        SlideTime = require('./slide-time'),
        Stat = require('../bg/util/stat');
    var chrome = window.chrome || window.sogouExplorer; //chrome 或 sougou

    seajs.use('bs');

    /**
     * 本地存储
     * @type {Object}
     */
    var local = {
        set: function(key, val) {
            console.log(key + ' -> ' + val);
            localStorage.setItem(key, val);
        },
        get: function(key) {
            return localStorage.getItem(key);
        }
    };

    /**
     * 渲染一个开关按钮
     * @param el
     */

    function rendOnoff(el) {
        var key = el.find('.onoffswitch-label').attr('for'),
            checkbox = $('#' + key),
            defaultV = local.get(key) || checkbox.attr('data-default'),
            localV = local.get(key);

        checkbox.prop('checked', defaultV == 'on' ? true : false);
        local.set(key, defaultV);
    }

    /**
     * 切换开关按钮
     * @param el
     */

    function switchOnoff(el) {
        var key = el.find('.onoffswitch-label').attr('for'),
            checkbox = $('#' + key),
            isChecked = checkbox.prop('checked');

        local.set(key, !isChecked ? 'on' : 'off');
    }

    /**
     * 渲染时间下拉
     * @param el
     */
    // function rendOptionTime(el) {
    //     var html = '',
    //         i = 0, max = 23;

    //     for (; i <= max; i++) {
    //         html += '<option value="' + i + '">' + i + ':00</option>'
    //     }
    //     $(el).html(html);
    // }

    $(document).ready(function() {

        // rendOptionTime('#quiet_time_b, #quiet_time_e');
        // $('#quiet_time_b').children('[value=' + local.get('quiet_time_b') + ']').prop('selected', true);
        // $('#quiet_time_e').children('[value=' + local.get('quiet_time_e') + ']').prop('selected', true);
        // $('#quiet_time_b, #quiet_time_e').on('change', function () {
        //     var self = $(this);
        //     local.set(self.attr('id'), self.val());
        // });
        
        //版本号
        $('#J_version').html(CONFIG['version']);

        $('.onoffswitch').each(function() {
            var self = $(this);
            rendOnoff(self);
            self.find('.onoffswitch-label').on('click', function() {
                switchOnoff($(this).parent());
            });
        });

        //安静时段
        var sT = new SlideTime({
            el: $('.slide-time'),
            isShow: local.get('is_notify_quiet') == 'on',
            bTime: local.get('quiet_time_b'),
            eTime: local.get('quiet_time_e')
        });

        $('#J_notify_quiet').on('click', function() {
            var key = $(this).parent().find('.onoffswitch-label').attr('for'),
                checkbox = $('#' + key),
                isChecked = checkbox.prop('checked');

            isChecked ? sT.show() : sT.hide();
        });


        //slide-tab
        $('.slide-tab').each(function() {
            var self = $(this),
                chs = self.find('li > a'),
                key = self.attr('for'),
                defaultV = local.get(key) || self.attr('data-default');

            //渲染默认值
            chs.each(function() {
                var cur = $(this);
                var v = cur.attr('value');

                if (v == defaultV) {
                    cur.parent().addClass('active');
                    return false;
                }
            });
            local.set(key, defaultV);

            //添加侦听
            self.delegate('a', 'click', function() {
                var ths = $(this),
                    li = ths.parent(),
                    key = li.parents('.slide-tab').attr('for'),
                    val = ths.attr('value');

                li.siblings('.active').removeClass('active');
                li.addClass('active');
                local.set(key, val);
            });
        });

        //版本弹窗侦听
        $('#J_ex_version').on('click', function() {
            $('#J_modal').modal();
        });

        //测试弹窗侦听
        $('#notify_desktop_test').on('click', function() {
            // var NOTI_TEST = CONFIG['notify_test'];
            // var notification = window.webkitNotifications.createNotification(
            //     NOTI_TEST.img, NOTI_TEST.title, NOTI_TEST.des);

            var NOTI_TEST = CONFIG["notify_test"];
                            var notification =new Notification(NOTI_TEST.title, {
                            icon: NOTI_TEST.img,
                            body: NOTI_TEST.des
                          });

            notification.onshow = function() { // 30秒后自动关闭
                console.log('is_notify_desk ->' + localStorage.getItem('desk_stop_time') * 1000);
                setTimeout(function() {
                    notification.close();
                }, localStorage.getItem('desk_stop_time') * 1000);
            };
            notification.onclick = function() { // 点击打开链接
                window.open("http://www.etao.com/?from=etaoyouhui");
                notification.close();
            };
        });

        Stat.addAEvent();
    });
});