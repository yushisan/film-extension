/**
 * 数据库初始 入口
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    var Msg = require('./msg'),
    	Low = require('./low'),
        Post9 = require('./post9'),
        Db = {};

    Db.init = function(back) {

        Msg.create(function(){
        	// Low.create(function(){

                Post9.create(function(){
    	            console.log('------------db init end');
                	back && back();
                });

        	// });
        });
    };

    module.exports = Db;
});