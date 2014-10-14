/**
 * sql语句
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {
    var SQL = {};

    SQL['db'] = {
        dbname: 'film_extension_db',
        version: '',
        display_name: 'film extension db',
        size: '10*1024*1024'
    };

    SQL['global'] = {
        //添加字段
        'add_column': 'ALTER TABLE {0} ADD column {1}'
    };

        //院线新片
    SQL['theater'] = {
        'name': 'theater', //表名

        //创建messages表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,status,flag,is_read)',
        //向messages表中插入数据
        'inserts': 'insert into {0} \
                (cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,status,flag,is_read) \
                values \
                ("{1}", \'{2}\', "{3}", "{4}", "{5}", "{6}", "{7}", \'{8}\', "{9}", "{10}", "{11}", {12}, {13}, {14})',
        //检查messages表中某条数据是否存在
        'check': 'select count(id) as count  from {0} where cid = "{1}"',
        //得到未读消息
        'get_unseen_count_sql': 'select count(*) as unseen_count from {0} where is_read = 0',
        //设置消息为已读
        'set_message_seen_sql': 'update {0} set is_read = {1} where id = {2}',
        //设置所有消息为已读
        'set_message_seen_all_sql': 'update {0} set is_read = 1',
        //查询messages表中的数据
        'select_messages': 'select \
                        cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,status,flag,is_read \
                        from {0} \
                        where flag = {1} \
                        order by checkuptime desc \
                        limit {2}',
        //查询messages表中所有的数据
        'select_all_messages': 'select cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,status,flag,is_read \
                from {0} \
                order by checkuptime desc \
                limit {1}',
        //更新messages表中数据
        'update_messages': 'update {0} set flag = {1} where id = {2}',
        //删除messages表中数据
        'delete': 'delete from {0} where id = {1}',
        //标记所有messages表中数据为已读
        'mark_all_readed_messages': 'update {0} set flag = {1}',
        'delete_more':'delete from {0} where checkuptime > {1}',
        //删除表
        'drop_table': 'DROP TABLE {0}',
        'select_by_page': 'select * \
                from {0} \
                order by checkuptime desc \
                limit {1}, {2}'
    };

    //即将上映
    SQL['trailer'] = {
        'name': 'trailer',
        //创建messages表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     cid,\
                     title, \
                     url, \
                     pic, \
                     desc, \
                     uptime, \
                     is_read\
                    )',
        'check':'select count(id) as count \
                        from {0} \
                        where cid = "{1}"',
        'inserts': 'insert into {0} \
                (cid,title,url,pic,desc,uptime,is_read) \
                values \
                ("{1}", \'{2}\', "{3}", "{4}", \'{5}\', "{6}", {7})',
        'select': 'select id,cid,title,url,pic,desc,uptime,is_read \
                from {0} order by id desc \
                limit {1}',
        'unread': 'select count(*) as un_read from {0} where is_read=0',
        'update_read': 'update {0} set is_read = 1',
        'delete': 'delete from {0} where id = {1}',
        'select_by_page': 'select id,cid,title,url,pic,desc,uptime,is_read \
                from {0} order by id desc \
                limit {1}, {2}'
    };



    module.exports = SQL;
});