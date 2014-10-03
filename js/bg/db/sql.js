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
        dbname: 'etao_notify_db',
        version: '',
        display_name: 'etao notify db',
        size: '10*1024*1024'
    };

    SQL['global'] = {
        //添加字段
        'add_column': 'ALTER TABLE {0} ADD column {1}'
    };

    //今日推荐
    SQL['msg'] = {
        'name': 'msg', //表名

        //创建messages表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     title, \
                     description, \
                     buy_link, \
                     etao_link, \
                     comment_link, \
                     image_url, \
                     author, \
                     pub_date, \
                     flag \
                    )',
        //向messages表中插入数据
        'inserts': 'insert into {0} \
                (title, description, buy_link, etao_link, comment_link, image_url, author, pub_date, flag, seen, pre_title, sale_title) \
                values \
                (\'{1}\', \'{2}\', "{3}", "{4}", "{5}", "{6}", "{7}", {8}, {9}, {10}, \'{11}\', \'{12}\')',
        //检查messages表中某条数据是否存在
        'check': 'select count(id) as count \
                        from {0} \
                        where buy_link = "{1}" or title = \'{2}\'',
        //得到未读消息
        'get_unseen_count_sql': 'select count(*) as unseen_count from {0} where seen = 0',
        //设置消息为已读
        'set_message_seen_sql': 'update {0} set seen = {1} where id = {2}',
        //设置所有消息为已读
        'set_message_seen_all_sql': 'update {0} set seen = 1',
        //查询messages表中的数据
        'select_messages': 'select \
                        id, title, pre_title, sale_title, description, buy_link, etao_link, comment_link, image_url, author, pub_date, flag \
                        from {0} \
                        where flag = {1} \
                        order by pub_date desc \
                        limit {2}',
        //查询messages表中所有的数据
        'select_all_messages': 'select id, title, description, buy_link, etao_link, comment_link, image_url, author, pub_date, flag, seen, pre_title, sale_title \
                from {0} \
                order by pub_date desc \
                limit {1}',
        //更新messages表中数据
        'update_messages': 'update {0} set flag = {1} where id = {2}',
        //删除messages表中数据
        'delete': 'delete from {0} where id = {1}',
        //标记所有messages表中数据为已读
        'mark_all_readed_messages': 'update {0} set flag = {1}',
        'delete_more':'delete from {0} where pub_date > {1}',
        //删除表
        'drop_table': 'DROP TABLE {0}',
        'select_by_page': 'select id, title, description, buy_link, etao_link, comment_link, image_url, author, pub_date, flag, seen, pre_title, sale_title \
                from {0} \
                order by pub_date desc \
                limit {1}, {2}'
    };

    //历史最低价
    SQL['low'] = {
        name: 'low',
        //创建messages表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     title, \
                     link, \
                     img_url, \
                     seller_name, \
                     final_price, \
                     comment, \
                     is_read \
                    )',
        'check':'select count(id) as count \
                        from {0} \
                        where link = "{1}" or title = "{2}"',
        'inserts': 'insert into {0} \
                (title, link, img_url, seller_name, final_price, comment, is_read) \
                values \
                (\'{1}\', "{2}", "{3}", "{4}", {5}, \'{6}\', {7})',
        'select': 'select id, title, link, img_url,seller_name,final_price,comment,is_read \
                from {0} order by id desc \
                limit {1}',
        'unread': 'select count(*) as un_read from {0} where is_read=0',
        'update_read': 'update {0} set is_read = 1',
        'delete': 'delete from {0} where id = {1}',
        'select_by_page': 'select id, title, link, img_url,seller_name,final_price,comment,is_read \
                from {0} order by id desc \
                limit {1}, {2}'
    };

    //历史最低价
    SQL['post9'] = {
        name: 'post9',
        //创建messages表
        'create': 'CREATE TABLE IF NOT EXISTS {0} \
                    (id integer primary key autoincrement, \
                     title, \
                     link, \
                     img_url, \
                     sellcnt, \
                     final_price, \
                     discount, \
                     is_read \
                    )',
        'check':'select count(id) as count \
                        from {0} \
                        where link = "{1}" or title = "{2}"',
        'inserts': 'insert into {0} \
                (title, link, img_url, sellcnt, final_price, discount, is_read) \
                values \
                (\'{1}\', "{2}", "{3}", {4}, {5}, {6}, {7})',
        'select': 'select id, title, link, img_url,sellcnt,final_price,discount,is_read \
                from {0} order by id desc \
                limit {1}',
        'unread': 'select count(*) as un_read from {0} where is_read=0',
        'update_read': 'update {0} set is_read = 1',
        'delete': 'delete from {0} where id = {1}',
        'select_by_page': 'select id, title, link, img_url,sellcnt,final_price,discount,is_read \
                from {0} order by id desc \
                limit {1}, {2}'
    };


    module.exports = SQL;
});