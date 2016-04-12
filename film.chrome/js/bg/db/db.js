/**
 * 数据库初始 入口
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    var Theater = require('./theater'),
        Trailer = require('./trailer'),
        Activity = require('./activity'),
        Db = {};

    Db.init = function(back) {
        Theater.create(function(){
            //console.log('------------Theater db init end');
            Trailer.create(function() {
                //console.log('------------Trailer db init end');
                Activity.create(function() {
                    //console.log('------------Activity db init end');
                    back && back();
                });
            });
        });
    };

    module.exports = Db;
});