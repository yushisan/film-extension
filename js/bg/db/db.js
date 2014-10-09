/**
 * 数据库初始 入口
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    var Msg = require('./msg'),
        Trailer = require('./trailer'),
        Db = {};

    Db.init = function(back) {

        Msg.create(function(){
            console.log('------------Msg db init end');
            Trailer.create(function() {
                console.log('------------Trailer db init end');
                back && back();
            });
        });
    };

    module.exports = Db;
});