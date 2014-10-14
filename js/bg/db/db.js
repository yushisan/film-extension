/**
 * 数据库初始 入口
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    var Theater = require('./theater'),
        Trailer = require('./trailer'),
        Db = {};

    Db.init = function(back) {
        Theater.create(function(){
            console.log('------------Msg db init end');
            Trailer.create(function() {
                console.log('------------Trailer db init end');
                back && back();
            });
        });
    };

    module.exports = Db;
});