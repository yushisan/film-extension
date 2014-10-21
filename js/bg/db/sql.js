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

        //创建表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,status,flag,is_read,timestamp)',
        //向表中插入数据
        'insert': 'insert into {0} \
                (cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,status,flag,is_read,timestamp) \
                values \
                ("{1}", \'{2}\', "{3}", "{4}", "{5}", "{6}", "{7}", \'{8}\', "{9}", "{10}", "{11}", {12}, {13}, {14}, {15})',
                 //更新数据
        'update': 'update {0} set title=\'{2}\',year="{3}",url="{4}",pic="{5}",dir="{6}",actor="{7}",brief=\'{8}\',checkuptime="{9}",douban="{10}",newscore="{11}",status={12},timestamp={13} where cid="{1}"',
        //检查表中某条数据是否存在
        'check': 'select count(id) as count  from {0} where cid = "{1}"',
        //得到未读消息
        'unread': 'select count(*) as unread_count from {0} where is_read = 0',
        //设置消息为已读
        'update_read': 'update {0} set is_read = {1} where id = {2}',
        //设置所有消息为已读
        'update_read_all': 'update {0} set is_read = 1',
        //查询表中的数据
        'select': 'select * from {0} where flag = {1} order by checkuptime desc limit {2}',
        //查询表中所有的数据
        'select_all': 'select * from {0}  order by checkuptime desc limit {1}',
        //更新表中数据
        'update_flag': 'update {0} set flag = {1} where id = {2}',
        //删除表中数据
        'delete': 'delete from {0} where id = {1}',
        //标记所有表中数据为已读
        'update_flag_all': 'update {0} set flag = {1}',
        'delete_more':'delete from {0} where checkuptime > {1}',
        'delete_old':'delete from {0} where timestamp != {1}',
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

        //创建表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,is_read,\
                    timestamp)',
        'check':'select count(id) as count from {0}  where cid = "{1}"',
        'insert': 'insert into {0} \
                (cid,title,year,url,pic,dir,actor,brief,checkuptime,douban,newscore,is_read,timestamp) \
                values \
                ("{1}", \'{2}\', "{3}", "{4}", "{5}", "{6}", "{7}", \'{8}\', "{9}", "{10}", "{11}",{12},{13})',
        //更新数据
        'update': 'update {0} set title=\'{2}\',year="{3}",url="{4}",pic="{5}",dir="{6}",actor="{7}",brief=\'{8}\',checkuptime="{9}",douban="{10}",newscore="{11}",timestamp= {12} where cid="{1}"',
        'select': 'select * from {0} order by id desc limit {1}',
        'unread': 'select count(*) as unread_count from {0} where is_read=0',
        'update_read_all': 'update {0} set is_read = 1',
        'delete': 'delete from {0} where id = {1}',
        'delete_old':'delete from {0} where timestamp != {1}',
        'select_by_page': 'select * from {0} order by id desc \
                limit {1}, {2}'
    };

    //会员活动
    SQL['activity'] = {
        'name': 'activity', //表名

        //创建表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                    aid,title,pic,url,desc,level,start,end,type,flag,is_read,timestamp)',
        //向表中插入数据
        'insert': 'insert into {0} \
                (aid,title,pic,url,desc,level,start,end,type,flag,is_read,timestamp) \
                values \
                ({1},\'{2}\', "{3}", "{4}", \'{5}\', "{6}", "{7}", "{8}", "{9}", {10}, {11},{12})',
        //更新数据
        'update': 'update {0} set title=\'{2}\',pic="{3}",url="{4}",desc=\'{5}\',level="{6}",start="{7}",end="{8}",type="{9}",timestamp={10} where aid={1}',
        //检查表中某条数据是否存在
        'check': 'select count(id) as count  from {0} where aid = {1}',
        //得到未读消息
        'unread': 'select count(*) as unread_count from {0} where is_read = 0',
        //设置消息为已读
        'update_read': 'update {0} set is_read = {1} where id = {2}',
        //设置所有消息为已读
        'update_read_all': 'update {0} set is_read = 1',
        //查询表中的数据
        'select': 'select * from {0}  where flag = {1} order by id desc limit {2}',
        //查询表中所有的数据
        'select_all': 'select * from {0} order by id desc limit {1}',
        //更新表中数据
        'update_flag': 'update {0} set flag = {1} where id = {2}',
        //删除表中数据
        'delete': 'delete from {0} where id = {1}',
        //标记所有表中数据为已读
        'update_flag_all': 'update {0} set flag = {1}',
        'delete_more':'delete from {0} where end < {1}',
        'delete_old':'delete from {0} where timestamp != {1}',
        //删除表
        'drop_table': 'DROP TABLE {0}',
        'select_by_page': 'select *  from {0} order by id desc limit {1}, {2}'
    };

    module.exports = SQL;
});