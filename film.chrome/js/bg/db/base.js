/**
 * 数据存储
 * @param  {[type]} require [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    //console.log('---------db');
    var SQL = require('./sql'),
        SQL_G = SQL['global'],
        DB_CFG = SQL['db'],
        Db = {};

    var ddd = new Date().getTime();

    window['db'] = null;

    Db = {
        db: null, //db 对象

        /**
         * 创建数据库
         */
        open: function() {
            try {
                return window['db'] = this.db = window.openDatabase(DB_CFG.dbname, DB_CFG.version, DB_CFG.display_name, DB_CFG.size);
            } catch (e) {
                console.log('Failed to connect to database.');
            }
        },

        /**
         * 创建表
         * @param  {[type]} back [回调]
         * @return {[type]}      [description]
         */
        create: function(back) {
            var tbSql = SQL[this.tb];
            this.executeSql(tbSql['create'], [tbSql['name']], function() {
                back && back();
            });
        },

        /**
         * 添加字段
         * @param {[type]}   column   [description]
         * @param {Function} callback [description]
         */
        addField: function(column, callback) {
            var tbSql = SQL[this.tb];

            this.executeSql(SQL_G['add_column'], [
                tbSql['name'],
                column
            ], callback, function() {
                callback && callback();
                console.log('----------已存在字段：' + column);
            });
        },

        /**
         * 插入表数据
         * @param  {[type]} data [数据]
         * @param  {[type]} back [回调]
         * @return {[type]}      [description]
         */
        inserts: function(data, back, order) {
            var self = this,
                len = Math.min(data.length, 100),
                i = order > 0 ? 0 : (len - 1);

            //console.log('----insterts data');
            if (!self.db) {
                self.db = window['db'] = self.open();
            }
            var timestamp = new Date().getTime();
            self.db.transaction(function(tx) {
                for (; order > 0 ? (i < len) : (i >= 0); order > 0 ? i++ : i--) {
                    try {
                        (function(i) {
                            var msg = self.formatInsert(data[i], timestamp);
                            self._check(tx, msg, function(tx, msg, isExit) {
                                if (isExit) {
                                    self._update(tx, msg.updateFields, function() {
                                        if (i == len - 1) {
                                            //console.log('insert time:' + (new Date().getTime() - ddd));
                                            self.delete_old(timestamp,back);
                                        }
                                    });
                                } else {
                                    self._insert(tx, msg.insertFields, function() {
                                        if (i == len - 1) {
                                            //console.log('insert time:' + (new Date().getTime() - ddd));
                                            self.delete_old(timestamp,back);
                                        }
                                    });
                                }
                            });
                        })(i);
                    } catch (e) {
                        continue;
                    }
                }

            });
        },

        /**
         * 检测该条数据是否存在
         * @param  {[type]} checkFields [检测字段]
         * @param  {[type]} back        [回调函数]
         * @return {[type]}             [description]
         */
        _check: function(tx, msg, back) {
            var tbSql = SQL[this.tb];
            tx.executeSql(this._formatSql(
                    tbSql['check'], [tbSql['name']].concat(msg.checkFields)
                ), [],
                function(tx, rs) {
                    back && back(tx, msg, rs.rows.item(0)['count'] > 0);
                }
            );
        },

        _update: function(tx, fields, back) {
            var tbSql = SQL[this.tb];
            tx.executeSql(this._formatSql(tbSql['update'], [tbSql['name']].concat(fields)), [],
                function(tx, rs) {
                    //console.log("_update success");
                    back && back();
                },
                function(tx, error) {
                    console.log('database error:' + error.message);
                }
            );
        },

        /**
         * 插入数据
         * @param  {[type]} fields [description]
         * @return {[type]}        [description]
         */
        _insert: function(tx, fields, back) {
            var tbSql = SQL[this.tb];
            tx.executeSql(this._formatSql(tbSql['insert'], [tbSql['name']].concat(fields)), [],
                function(tx, rs) {
                    //console.log("_insert  success");
                    back && back();
                },
                function(tx, error) {
                    console.log('database error:' + error.message);
                }
            );
        },

        /**
         * 删除数据
         * @param id
         * @param back
         */
        delete: function(id, back) {
            var tbSql = SQL[this.tb];

            this.executeSql(tbSql['delete'], [
                tbSql['name'],
                id
            ], function() {
                back && back();
            });
        },

        /**
         * 删除旧数据
         * @param id
         * @param back
         */
        delete_old: function(timestamp, back) {
            var tbSql = SQL[this.tb];
            this.executeSql(tbSql['delete_old'], [
                tbSql['name'],
                timestamp
            ], function() {
                back && back();
            });
        },

        /**
         * 通过页码查询
         * @param  {[type]} back    [回调]
         * @param  {[type]} pagenum [页码]
         * @param  {[type]} size    [每页条数]
         * @return {[type]}         [description]
         */
        selectByPage: function(back, pagenum, size) {
            var tbSql = SQL[this.tb];
            var begin = (pagenum - 1) * size;

            this.executeSql(tbSql['select_by_page'], [
                tbSql['name'],
                begin,
                size
            ], function(rs) {
                var result_array = [];

                for (var i = 0; i < rs.rows.length; i++) {
                    result_array.push(rs.rows.item(i));
                }
                back(result_array);
            });
        },

        /**
         * 执行sql语句
         * @param sql sql语句
         * @param params 执行sql语句参数
         * @param back 执行成功回调
         * @param error 执行失败回调
         */
        executeSql: function(sql, params, back, errorBack) {
            var self = this,
                db = self.db || window['db'];

            if (!db) {
                //console.log('创建/打开数据库');
                db = self.open();
            }
            db.transaction(function(tx) {
                tx.executeSql(self._formatSql(sql, params), [],
                    function(tx, rs) {
                        back && back(rs);
                    },
                    function(tx, error) {
                         console.log('database error:' + error.message);
                        errorBack && errorBack(error);
                    });
            });
        },

        /**
         * 格式化sql
         * @private
         */
        _formatSql: function(sql, arr) {
            if (sql && sql.replace) {

            } else {
                console.log(sql);
            }
            return sql.replace(/{(\d+)}/g, function(match, number) {
                return typeof arr[number] != 'undefined' ? arr[number] : match;
            });
        }
    };

    module.exports = Db;

});
