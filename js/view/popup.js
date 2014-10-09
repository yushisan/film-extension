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
    var chrome = window.chrome || window.sogouExplorer; //chrome 或 sougou

    if (!chrome.cookies) {
        chrome.cookies = chrome.experimental.cookies;
    }


    $(function() {
        var bgWindow = chrome.extension.getBackgroundPage();

        var Notify = require('../bg/notify/notify'),
            DbMsg = bgWindow.Msg,
            DbTrailer = bgWindow.Trailer,
            Stat = require('../bg/util/stat');

       var see_more_url = {
            '1': 'http://film.qq.com/theater.html',
            '2': 'http://film.qq.com/theater.html?page=trailer'
        };

        var pageNo = 1,
            curLiTy = 1;


        function rendPage(ty, back) {
            switch (ty) {
                case '1': //院线新片
                    rendTodayPage(back);
                    curLiTy = '1';
                    return;
                case '2': //即将上映
                    rendTrailerPage(back);
                    curLiTy = '2';
                    break;
            }
        }

        function rendTodayPage(back) {
            DbMsg.selectByPage(function(data) {
                if (data.length <= 0) {
                    setTimeout(function() {
                        rendTodayPage(back);
                    }, 500);
                    return;
                }
                if (pageNo == 1) {
                    $('#J_today_c').html(getHtml(1, data));
                } else {
                    $('#J_today_c').append(getHtml(1, data));
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

        function getHtml(ty, data) {
            var html = '',
                i = 0,
                len = data.length,
                getStr = ty == 1 ? getTodayHtml : ty == 2 ? getTrailerHtml : ty == 3 ? getPostHtml : null;

            // len = len > 30 ? 30 : len;

            for (; i < len; i++) {
                html += getStr(data[i]);
            }
            return html;
        }

        function getTodayHtml(obj) {
            return '<div class="today-item dib-wrap">\
                        <div class="item-img dib">' + (obj.seen == 0 ? '<i class="item-new"></i>' : '<i class="item-new item-new-old"></i>') +
                '<a href="' + obj.buy_link + '?ptag=film.extension.chrome" target="_blank">\
                                <img src="' + obj.image_url + '" style="width:120px;" />\
                            </a>\
                        </div>\
                        <div class="item-side dib">\
                            <h2 class="item-title"><a href="' + obj.buy_link + '?ptag=film.extension.chrome" target="_blank">' + obj.title + '</a></h2>\
                            <br/>'+obj.description+'\
                            <div class="item-sub clearfix">\
                                <span class="item-time">' + formatDate(obj.pub_date) + '</span>\
                                <a href="' + obj.buy_link + '?ptag=film.extension.chrome" target="_blank" class="item-buy-bt">立即观看</a>\
                            </div>\
                        </div>\
                    </div>';
        }

         function getTrailerHtml(obj) {
            return '<div class="today-item dib-wrap">\
                        <div class="item-img dib">' + (obj.is_read == 0 ? '<i class="item-new"></i>' : '<i class="item-new item-new-old"></i>') +
                '<a href="' + obj.url + '?ptag=film.extension.chrome" target="_blank">\
                                <img src="' + obj.pic + '" style="width:120px;" />\
                            </a>\
                        </div>\
                        <div class="item-side dib">\
                            <h2 class="item-title"><a href="' + obj.url + '?ptag=film.extension.chrome" target="_blank">' + obj.title + '</a></h2>\
                            <br/>'+obj.desc+'\
                            <div class="item-sub clearfix">\
                                <span class="item-time">' + obj.uptime + '</span>\
                                <a href="' + obj.link + '" target="_blank" class="item-buy-bt">立即观看</a>\
                            </div>\
                        </div>\
                    </div>';
        }

        function formatDate(time) {
            var date = new Date(time);
            var addZero = function(str) {
                str = String(str);
                return str.length == 1 ? 0 + str : str;
            };
            return addZero(date.getYear()) + '-' +addZero(date.getMonth() + 1) + '-' + addZero(date.getDate());
        }

        $('#J_eato_tb').delegate('li', 'click', function() {
            var self = $(this),
                order = self.attr('order'),
                tabC = $('#J_eato_tb_content'),
                chs = tabC.children();

            pageNo = 1;

            rendPage(order, function() {

                $('#J_eato_tb_content').scrollTop(0);
                self.siblings('.active').removeClass('active');
                self.addClass('active');
                chs.css('display', 'none');
                chs.filter('[order=' + order + ']').css('display', 'block');
                $('#J_see_more').attr('href', see_more_url[order]);
            });
        });

        $('#J_eato_tb > li').eq(0).trigger('click');

        $('#J_eato_tb_content').scroll(function(e) {
            var self = $(this),
                content;

            switch (curLiTy) {
                case '1':
                    content = $('#J_today_c');
                    break;
                case '2':
                    content = $('#J_low_c');
                    break;
                case '3':
                    content = $('#J_post_c');
                    break;
            }

            if (self.scrollTop() >= content.height() - self.height()) {

                rendPage(curLiTy, function() {});
            }
        });


        Notify.getIconCount(function(count) {
            var today = $('#J_tip_today');

            if (count == 0) {
                today.hide();
            } else {
                $('#J_tip_today_num').html(count);
                today.show();
            }
        });
        Notify.clearIconText();

        // DbLow.getUnReadCount(function(count) {
        //     var today = $('#J_tip_low');

        //     if (count == 0) {
        //         today.hide();
        //     } else {
        //         $('#J_tip_low_num').html(count);
        //         today.show();
        //     }
        // });

        // try{
        // 

        DbPost9.getUnReadCount(function(count) {
            var today = $('#J_tip_post9');

            console.log('----------------conunt = ' + count);
            if (count == 0) {
                today.hide();
            } else {
                $('#J_tip_post9_num').html(count);
                today.show();
            }
        });

        Stat.addAEvent();

    });

});