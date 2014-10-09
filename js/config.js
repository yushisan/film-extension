define(function(require, exports, module) {

    var CONFIG = {};

    module.exports = CONFIG;

    CONFIG['version'] = '0.1';

    //请求数据地址
    CONFIG['url'] = {
        'theater':'http://sns.video.qq.com/fcgi-bin/dlib/dataout_pc?auto_id=1471&otype=json&callback=jsonp',
        'trailer':'http://sns.video.qq.com/fcgi-bin/dlib/dataout_pc?auto_id=1472&otype=json&callback=jsonp'
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
        img: '../img/icon_80.png',
        title: '好莱坞影院',
        des: '好莱坞会员是由腾讯视频面向广大用户推出的一项尊贵增值包月会员服务，会员可在好莱坞影院film.qq.com上观看来自华纳、环球、迪士尼等好莱坞电影豪门的上千部经典大片，且享有观看国内最新院线影片网络首播的特权。'
    };

    //消息类型
    CONFIG['msg_ty'] = {
        'new': 0, //新消息
        'nodifyed': 1, //已通知
    };

    //数据库
    CONFIG['db'] = {
        dbname: 'film_extension_db',
        version: '',
        display_name: 'film extension db',
        size: '10*1024*1024'
    };

});