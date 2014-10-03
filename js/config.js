/**
 * Detail:配置信息
 * User: wb-wangling
 * Date: 13-9-4
 * Time: 下午3:25
 */
define(function(require, exports, module) {

    var CONFIG = {};

    module.exports = CONFIG;

    CONFIG['version'] = '0.4.7';

    //请求数据地址
    CONFIG['url'] = {
        'theater': 'http://film.qq.com/weixin/json/theater_1.json?timestmp=', //院线新片
        'today': 'http://www.etao.com/api/get-yh-jsonp.html?from=etaoyouhui', //今日推荐
        'low': 'http://www.etao.com/api/get-api-page.html?pageID=1&category=all&timestamp&_ksTS=1379066289859_475&callback=jsonp476&tab_type=lowest', //品牌最低价
        'post9': 'http://www.etao.com/api/get-api-page.html?pageID=1&category=all&timestamp&_ksTS=1379066434795_574&callback=jsonp575&tab_type=mailfree' //9.9包邮
    };

    //各种数量
    CONFIG['count'] = {
        'max_today_data': 50 //今日推荐pull的数据每次入库最多条数
    };

    //定时器间隔时间设置
    CONFIG['timer'] = {
        'today_pull': 1 * 60 * 1000, //拉今日推荐数据时间间隔
        'low_pull': 5 * 60 * 1000,  //拉品牌最低价数据时间间隔
        'post9_pull': 5 * 60 * 1000 //拉9.9包邮数据时间间隔
    };

    //设置页 弹窗测试
    CONFIG['notify_test'] = {
        img: '../img/icon_80x80.png',
        title: '一淘网',
        des: '一淘网，最好的一站式购物入口，为您提供专业的比较购物搜索服务; 提供互联网最新最全的精彩购物活动，打折促销信息；团购网站大全信息。为了让您作出最精明的购物决策，我们一直在努力。'
    };

    //消息类型
    CONFIG['msg_ty'] = {
        'new': 0, //新消息
        'nodifyed': 1, //已通知
    };

    //数据库
    CONFIG['db'] = {
        dbname: 'etao_notify_db',
        version: '',
        display_name: 'etao notify db',
        size: '10*1024*1024'
    };

});