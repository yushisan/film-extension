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

    $(function() {
        var bgWindow = chrome.extension.getBackgroundPage();

        var Notify = require('../bg/notify/notify'),
            // DbMsg = require('../bg/db/msg'),
            // DbLow = require('../bg/db/low'),
            // DbPost9 = require('../bg/db/post9'),
            DbMsg = bgWindow.Msg,
            DbPost9 = bgWindow.Post9,
            Stat = require('../bg/util/stat');

        var url_low = 'http://www.etao.com/api/get-api-page.html?pageID=1&category=all&timestamp&_ksTS=1379066289859_475&callback=jsonp476&tab_type=lowest';
        var url_post = "http://www.etao.com/api/get-api-page.html?pageID=1&category=all&timestamp&_ksTS=1379066434795_574&callback=jsonp575&tab_type=mailfree";
        var see_more_url = {
            '1': 'http://www.etao.com/?from=etaoyouhui&tab_type=feed',
            '2': 'http://www.etao.com/?from=etaoyouhui&tab_type=lowest',
            '3': 'http://www.etao.com/?from=etaoyouhui&tab_type=mailfree'
        };

        var url_theater='http://film.qq.com/weixin/json/theater_1.json?timestmp=1411290132256';

        var pageNo = 1,
            curLiTy = 1;


        function rendPage(ty, back) {
            switch (ty) {
                case '0'://院线新片
                     rendTheaterPage(back);
                    curLiTy = '1';
                    return;
                case '1': //今日推荐
                    rendTodayPage(back);
                    curLiTy = '1';
                    return;
                case '2': //品牌最低价
                    rendLowPage(back);
                    curLiTy = '2';
                    break;
                case '3': //9.9包邮
                    rendPost9Page(back);
                    curLiTy = '3';
                    break;
            }
        }

      function rendTheaterPage(back) {
            DbMsg.selectByPage(function(data) {
                if (data.length <= 0) {
                    setTimeout(function() {
                        rendTheaterPage(back);
                    }, 500);
                    return;
                }
                if (pageNo == 1) {
                    $('#J_theater_c').html(getHtml(0, data));
                } else {
                    $('#J_theater_c').append(getHtml(0, data));
                }
                back();
                pageNo++;
            }, pageNo, 15);

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

        function rendLowPage(back) {

            DbLow.selectByPage(function(data) {
                if (data.length <= 0) {
                    return;
                }
                if (pageNo == 1) {
                    $('#J_low_c').html(getHtml(2, data));
                } else {
                    $('#J_low_c').append(getHtml(2, data));
                }
                DbLow.updateReadAll();
                back();

                pageNo++;
            }, pageNo, 30);

        }

        function rendPost9Page(back) {

            DbPost9.selectByPage(function(data) {
                if (data.length <= 0) {
                    return;
                }
                if (pageNo == 1) {
                    $('#J_post_c').html(getHtml(3, data));
                } else {
                    $('#J_post_c').append(getHtml(3, data));
                }
                DbPost9.updateReadAll();
                back();

                pageNo++;

            }, pageNo, 30);

        }

        function getHtml(ty, data) {
            var html = '',
                i = 0,
                len = data.length,
                getStr =ty == 0 ? getTheaterHtml: ty == 1 ? getTodayHtml : ty == 2 ? getLowHtml : ty == 3 ? getPostHtml : null;

            // len = len > 30 ? 30 : len;

            for (; i < len; i++) {
                html += getStr(data[i]);
            }
            return html;
        }

        function getTheaterHtml(obj) {
            return '<div class="today-item dib-wrap">\
                        <div class="item-img dib">' + (obj.seen == 0 ? '<i class="item-new"></i>' : '<i class="item-new item-new-old"></i>') +
                '<a href="' + obj.buy_link + '" target="_blank">\
                                <img src="' + obj.image_url + '_120x120" />\
                            </a>\
                        </div>\
                        <div class="item-side dib">\
                            <h2 class="item-title"><a href="' + obj.buy_link + '" target="_blank">' + obj.pre_title + '<strong class="item-title-em">' + obj.sale_title + '</strong></a></h2>\
                            <div class="item-sub clearfix">\
                                <span class="item-time">' + formatDate(obj.pub_date) + '</span>\
                                <a href="' + obj.buy_link + '" target="_blank" class="item-buy-bt">观看影片</a>\
                            </div>\
                        </div>\
                    </div>';
        }

        function getTodayHtml(obj) {
            return '<div class="today-item dib-wrap">\
                        <div class="item-img dib">' + (obj.seen == 0 ? '<i class="item-new"></i>' : '<i class="item-new item-new-old"></i>') +
                '<a href="' + obj.buy_link + '" target="_blank">\
                                <img src="' + obj.image_url + '_120x120" />\
                            </a>\
                        </div>\
                        <div class="item-side dib">\
                            <h2 class="item-title"><a href="' + obj.buy_link + '" target="_blank">' + obj.pre_title + '<strong class="item-title-em">' + obj.sale_title + '</strong></a></h2>\
                            <div class="item-sub clearfix">\
                                <span class="item-time">' + formatDate(obj.pub_date) + '</span>\
                                <a href="' + obj.buy_link + '" target="_blank" class="item-buy-bt">优惠购买</a>\
                            </div>\
                        </div>\
                    </div>';
        }

        function getLowHtml(obj) {
            return '<div class="low-item dib">\
                        <div class="item-img">\
                            <a href="' + obj.link + '" target="_blank">\
                                <img src="' + obj.img_url + '_130x130" />\
                            </a>\
                        </div>\
                        <div class="item-shop">' + obj.seller_name + '</div>\
                        <h2 class="item-title"><a href="' + obj.link + '" title="' + obj.title + '" target="_blank">' + obj.title + '</a></h2>\
                        <div class="item-price">￥<span class="price">' + obj.final_price + '</span></div>' + (obj.comment ? '<div class="item-from">' + obj.comment + '</div>' : '') +
                '</div>';
        }

        function getPostHtml(obj) {
            return '<div class="post-item dib">\
                    <div class="item-img">\
                        <a href="' + obj.link + '" target="_blank">\
                            <img src="' + obj.img_url + '_130x130" />\
                        </a>\
                    </div>' + (obj.sellcnt ? ('<div class="item-shop">月销量' + obj.sellcnt + '件</div>') : '') +
                '<h2 class="item-title"><a href="' + obj.link + '" title="' + obj.title + '" target="_blank">' + obj.title + '</a></h2>\
                    <div class="item-sub clearfix">\
                        <div class="item-price">￥<span class="price">' + obj.final_price + '</span></div>\
                        <a class="item-save">' + obj.discount + '折</a>\
                    </div>\
                </div>';
        }

        function formatDate(time) {
            var date = new Date(time);
            var addZero = function(str) {
                str = String(str);
                return str.length == 1 ? 0 + str : str;
            };
            return addZero(date.getMonth() + 1) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
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