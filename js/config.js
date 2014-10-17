define(function(require, exports, module) {

    var CONFIG = {};

    module.exports = CONFIG;

    CONFIG['version'] = '0.1.1';

    //请求数据地址
    CONFIG['url'] = {
        'theater':'http://sns.video.qq.com/fcgi-bin/dlib/dataout_pc?auto_id=1471&otype=json&callback=jsonp',
        'trailer':'http://sns.video.qq.com/fcgi-bin/dlib/dataout_pc?auto_id=1472&otype=json&callback=jsonp',
        'activity':'http://sns.video.qq.com/fcgi-bin/dlib/dataout_pc?auto_id=1480&otype=json&callback=jsonp'
    };

    //定时器间隔时间设置
    CONFIG['timer'] = {
        'theater_pull': 3 * 60 * 1000, 
        'trailer_pull': 5 * 60 * 1000,
        'activity_pull': 3 * 60 * 1000
    };

    //设置页 弹窗测试
    CONFIG['notify_test'] = {
        img: '../img/icon_80.png',
        title: '好莱坞影院',
        des: '好莱坞会员是由腾讯视频面向广大用户推出的一项尊贵增值包月会员服务，会员可在好莱坞影院film.qq.com上观看来自华纳、环球、迪士尼等好莱坞电影豪门的上千部经典大片，且享有观看国内最新院线影片网络首播的特权。'
    };

    //消息标示
    CONFIG['msg_flag'] = {
        'new': 0, //新消息
        'nodifyed': 1, //已通知
    };

});