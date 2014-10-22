//seajs配置
seajs.config({
    base: "../js/sea-modules/",
    alias: {
        "jQuery": "jquery/jquery/1.10.1/jquery-debug.js"
    }
});

//作用当前main模块
seajs.use('../js/view/popup');

define(function(require, exports, module) {
    var $ = require('jQuery');
    var chrome = window.chrome || window.sogouExplorer; //chrome 或 sogou

    if (!chrome.cookies) {
        chrome.cookies = chrome.experimental.cookies;
    }
    $(function() {
        var bgWindow = chrome.extension.getBackgroundPage();

        var Notify = require('../bg/notify/notify'),
            DbTheater = bgWindow.Theater,
            DbTrailer = bgWindow.Trailer,
            DbActivity = bgWindow.Activity,
            Stat = require('../bg/util/stat'),
            Login = require('./login');

        var more_url = {
            '1': 'http://film.qq.com/theater.html',
            '2': 'http://film.qq.com/theater.html?page=trailer',
            '3': 'http://film.qq.com/activity.html'
        };

        var pageNo = 1,
            curTab = 1;

        function rendPage(ty, back) {
            switch (ty) {
                case '1': //院线新片
                    rendTheaterPage(back);
                    curTab = '1';
                    return;
                case '2': //即将上映
                    rendTrailerPage(back);
                    curTab = '2';
                    break;
                case '3': //会员活动
                    rendActivityPage(back);
                    curTab = '3';
                    break;
            }
        }

        function rendTheaterPage(back) {
            DbTheater.selectByPage(function(data) {
                if (data.length <= 0) {
                    return;
                }
                if (pageNo == 1) {
                    $('#J_theater_c').html(getHtml(1, data));
                } else {
                    $('#J_theater_c').append(getHtml(1, data));
                }
                back();
                pageNo++;
            }, pageNo, 15);

        }

        function rendTrailerPage(back) {

            DbTrailer.selectByPage(function(data) {
                if (data.length <= 0) {
                    return;
                }
                if (pageNo == 1) {
                    $('#J_trailer_c').html(getHtml(2, data));
                } else {
                    $('#J_trailer_c').append(getHtml(2, data));
                }
                DbTrailer.updateReadAll();
                back();

                pageNo++;
            }, pageNo, 30);

        }

        function rendActivityPage(back) {

            DbActivity.selectByPage(function(data) {
                if (data.length <= 0) {
                    return;
                }
                if (pageNo == 1) {
                    $('#J_activity_c').html(getHtml(3, data));
                } else {
                    $('#J_activity_c').append(getHtml(3, data));
                }
                DbActivity.updateReadAll();
                back();

                pageNo++;
            }, pageNo, 10);

        }

        function getHtml(ty, data) {
            var html = '',
                i = 0,
                len = data.length,
                getStr = ty == 1 ? getTheaterHtml : ty == 2 ? getTrailerHtml : ty == 3 ? getActivityHtml : null;

            for (; i < len; i++) {
                html += getStr(data[i]);
            }
            return html;
        }

        function getTheaterHtml(obj) {

            return '<div class="film_detail" style="margin-top: 40px;position: relative;">\
                    <i class="' + (obj.read == 0 ? 'item-new' : 'item-new item-new-old') + '" ></i>\
                    <div class="summary">\
                        <div class="summary_poster" >\
                            <a href="' + obj.url + '" class="mod_video_lists_poster">\
                                <img src="' + obj.pic + '" alt="' + obj.title + '">\
                               ' + (obj.status == 4 ? '<i class="mark_vip_coupon">会员用券</i>' : '<i class="mark_vip_free">会员免费</i>') + '\
                            </a>\
                        </div>\
                        <div class="summary_title">\
                            <h1 class="tit">' + obj.title + '</h1>\
                            <p class="sub_title">' + obj.brief + '</p>\
                            <p class="rating">\
                                <span class="score_wrap">\
                                    <strong class="score_tx">' + obj.newscore + '</strong>\
                                    <span class="score_douban">（豆瓣: ' + obj.douban + '）</span>\
                                </span>\
                            </p>\
                            <p class="director" id="director">\
                                <span class="label">导演：</span>' + obj.dir + '\
                            </p>\
                            <p class="starring" id="actor">\
                                <span class="label">主演：' + obj.actor + '\
                            </p>\
                            <p>\
                                <span class="">上线：' + obj.checkuptime + '</span> <a href="' + obj.url + '" class="item-btn" target="_blank" style="">立即观看</a>\
                            </p>\
                        </div>\
                    </div>\
                </div>';
        }

        function getTrailerHtml(obj) {

            return '<div class="film_detail" style="margin-top: 40px;position: relative;">\
                    <i class="' + (obj.read == 0 ? 'item-new' : 'item-new item-new-old') + '" ></i>\
                    <div class="summary">\
                        <div class="summary_poster" >\
                            <a href="' + obj.url + '" class="mod_video_lists_poster">\
                                <img src="' + obj.pic + '" alt="' + obj.title + '">\
                            </a>\
                        </div>\
                        <div class="summary_title">\
                            <h1 class="tit">' + obj.title + '</h1>\
                            <p class="sub_title">' + obj.brief + '</p>\
                            <p class="rating">\
                                <span class="score_wrap">\
                                    <strong class="score_tx">' + obj.newscore + '</strong>\
                                    <span class="score_douban">（豆瓣: ' + obj.douban + '）</span>\
                                </span>\
                            </p>\
                            <p class="director" id="director">\
                                <span class="label">导演：</span>' + obj.dir + '\
                            </p>\
                            <p class="starring" id="actor">\
                                <span class="label">主演：' + obj.actor + '\
                            </p>\
                            <p>\
                                <span class="">上线：' + formatUptime(obj.checkuptime) + '</span> <a href="' + obj.url + '" class="item-btn" target="_blank" style="">观看预告</a>\
                            </p>\
                        </div>\
                    </div>\
                </div>';
        }

        function getActivityHtml(obj) {
            return '<div class="mod_activity" style="margin-top: 40px;position: relative;">\
            <i class="' + (obj.read == 0 ? 'item-new' : 'item-new item-new-old') + '" ></i>\
            <div class="activity_cover">\
                <a href="' + obj.url + '" target="_blank" class="cover_link">\
                    <img src="' + obj.pic + '" class="cover_img" alt="">\
                </a>\
            </div>\
            <div class="activity_info">\
                <h4 class="title">' + obj.title + '</h4>\
                <p class="txt">' + obj.desc + '</p>\
                <p class="txt">有效期：' + obj.end.split(' ')[0] + ' <a href="' + obj.url + '" target="_blank" class="item-btn">查看活动</a></p>\
            </div>\
            </div>';
        }

        function formatUptime(str) {
            var uptime = str;
            if (!!str == false) {
                uptime = "敬请期待";
            } else {
                var arr = str.split('.')
                if (arr[0] >= '3000') {
                    uptime = "敬请期待";
                }
            }
            return uptime;
        }

        function formatDate(time) {
            var date = new Date(time);
            var addZero = function(str) {
                str = String(str);
                return str.length == 1 ? 0 + str : str;
            };
            return addZero(date.getYear()) + '-' + addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
        }

        $('#J_film_tb').delegate('li', 'click', function() {
            var self = $(this),
                order = self.attr('order'),
                tabC = $('#J_film_tb_content'),
                chs = tabC.children();

            pageNo = 1;

            rendPage(order, function() {
                self.find('.icon-content').html('');
                self.find('.title-icon').hide();
                $('#J_film_tb_content').scrollTop(0);
                self.siblings('.active').removeClass('active');
                self.addClass('active');
                chs.css('display', 'none');
                chs.filter('[order=' + order + ']').css('display', 'block');
                $('#J_see_more').attr('href', more_url[order]);
            });
        });

        $('#J_film_tb > li').eq(0).trigger('click');

        $('#J_film_tb_content').scroll(function(e) {
            var self = $(this),
                content;

            switch (curTab) {
                case '1':
                    content = $('#J_theater_c');
                    break;
                case '2':
                    content = $('#J_trailer_c');
                    break;
                case '3':
                    content = $('#J_activity_c');
                    break;
            }

            if (self.scrollTop() >= content.height() - self.height()) {

                rendPage(curTab, function() {});
            }
        });


        DbTheater.getUnReadCount(function(count) {
            var tip = $('#J_tip_theater');
            //console.log('----------------theater count = ' + count);
            if (count == 0) {
                tip.hide();
            } else {
                $('#J_tip_theater_num').html(count);
                tip.show();
            }
            DbTrailer.getUnReadCount(function(count) {
                var tip = $('#J_tip_trailer');
                //console.log('----------------trailer count = ' + count);
                if (count == 0) {
                    tip.hide();
                } else {
                    $('#J_tip_trailer_num').html(count);
                    tip.show();
                }
                DbActivity.getUnReadCount(function(count) {
                    tip = $('#J_tip_activity');
                    //console.log('----------------activity count = ' + count);
                    if (count == 0) {
                        tip.hide();
                    } else {
                        $('#J_tip_activity_num').html(count);
                        tip.show();
                    }
                    Notify.clearIconText();
                });
            });

        });


        function init() {
            Login.isLogin(function(islogin) {
                if (!islogin) {
                    $('.avatar_user').hide();
                    $('.btn_user_text').show();
                } else {
                    Login.getToken(function(token) {
                        Login.getUin(function(uin) {
                            if (localStorage.getItem('uin') && uin == localStorage.getItem('uin')) {
                                $('#head_img').attr('src', localStorage.getItem('face'));
                                $('#nickname').text(localStorage.getItem('nick'));
                                if (localStorage.getItem('ticket')) {
                                    $("#ticket_num").html(localStorage.getItem('ticket'));
                                }
                                if (localStorage.getItem('vip')) {
                                    var json = {
                                        vip: localStorage.getItem('vip'),
                                        level: localStorage.getItem('level'),
                                        annualvip: localStorage.getItem('annualvip')
                                    };
                                    showVip(json);
                                }
                            } else {
                                getNick(uin, token);
                            }
                            getTicket(uin, token);
                            getVipInfo(uin, token)
                        });
                    });
                }
            });
        }

        function getNick(uin, token) {
            $.ajax({
                url: "http://c.video.qq.com/cgi-bin/login?otype=json&nes=1&low_login=1&callback=jsonp",
                data: {
                    g_tk: token
                },
                dataType: "text",
                success: function(text) {
                    var mchs = text.match(/[\w]+\((.*)\)/);
                    var json = JSON.parse(mchs && mchs[1] ? mchs[1] : {});
                    if (json && json.result && json.result.code == 0) {
                        $('#head_img').attr('src', json.qqface);
                        $('#nickname').text(json.nick);
                        localStorage.setItem('uin', uin);
                        localStorage.setItem('face', json.qqface);
                        localStorage.setItem('nick', json.nick);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
                }
            });
        }

        function getTicket(uin, token) {
            $.ajax({
                url: "http://pay.video.qq.com/fcgi-bin/user_ticket?otype=json&callback=jsonp&low_login=1&status=1&_t=1&platform=1",
                data: {
                    g_tk: token,
                    uin: uin
                },
                dataType: "text",
                success: function(text) {
                    var mchs = text.match(/[\w]+\((.*)\)/);
                    var json = JSON.parse(mchs && mchs[1] ? mchs[1] : {});
                    if (json && json.result && json.result.code == 0) {
                        var num = parseInt(json.watch_tt, 10) + parseInt(json.vip_tt, 10);
                        $("#ticket_num").html(num);
                        localStorage.setItem('ticket', num);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
                }
            });
        }

        function getVipInfo(uin, token) {
            $.ajax({
                url: "http://pay.video.qq.com/fcgi-bin/payvip?otype=json&getannual=1&callback=jsonp&low_login=1&t=0&getqqvip=0",
                data: {
                    g_tk: token,
                    uin: uin
                },
                dataType: "text",
                success: function(text) {
                    var mchs = text.match(/[\w]+\((.*)\)/);
                    var json = JSON.parse(mchs && mchs[1] ? mchs[1] : {});
                    if (json && json.result && json.result.code == 0) {
                        showVip(json);
                        localStorage.setItem('vip', json.vip);
                        localStorage.setItem('annualvip', json.annualvip);
                        localStorage.setItem('level', json.level);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.readyState + XMLHttpRequest.status + XMLHttpRequest.responseText);
                }
            });
        }

        function showVip(json) {
            if (json.vip == 1) {
                $(".icon_vip").removeClass("icon_notVip");
                if (json.level && json.level > 0) {
                    $(".icon_vip > .num").show();
                    $(".icon_vip > .num").addClass("num_" + json.level);
                    $(".icon_vip > .num").text("等级" + json.level);
                } else {
                    $(".icon_vip > .num").hide();
                }
                if (json.annualvip == 1) {
                    $(".icon_year").addClass("icon_year_actived");
                }

            } else {
                $(".icon_vip").addClass("icon_notVip");
                $(".icon_year").removeClass("icon_year_actived");
                if (json.level && json.level > 0) {
                    $(".icon_vip > .num").show();
                    $(".icon_vip > .num").addClass("num_" + json.level);
                    $(".icon_vip > .num").text("等级" + json.level);
                } else {
                    $(".icon_vip > .num").hide();
                }
            }
        }

        init();

        Stat.addAEvent();
    });

});
