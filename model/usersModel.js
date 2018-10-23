//数据库处理代码
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

const usersModel = {
    /**
     * 注册
     * @param{Object} data 注册信息
     * @param{Function} cb 
     */
    add(data, cb) {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                console.log('连接数据库失败',err);
                cb({code:-100,msg:'连接数据库失败'});
                return;
            };
            const db = client.db('zhuce');

            let sdata = {
                username: data.username,
                password: data.password,
                nickname: data.nickname,
                phone: data.phone,
                is_admin: data.isAdmin
            };

            db.collection('users').find({username: sdata.username}).count(function (err, num) {
                if (err) {
                    cb({code:-101, msg:"查询用户是否注册失败"});
                    client.close();
                }else if(num !==0){
                    console.log('注册过了');
                    cb({code:-101, msg:"用户注册过了"});
                    client.close();
                }else{
                    console.log('没有注册,可以进行注册');
                    db.collection('users').find().count(function (err, num) {
                        if (err){
                            cb({code:-101, msg:"查询用户记录条数失败"});
                            client.close();
                        }else{
                             sdata._id = num + 1;
                        console.log(sdata);
                        db.collection('users').insertOne(sdata, function (err) {
                            if (err) {
                                cb({code:-101, msg:"注册失败"});
                            }else{
                                console.log('注册成功');
                                cb(null);
                            }                          
                            client.close();
                        });
                        }
                    });
                }
                // if (num === 0) {
                //     db.collection('users').find().count(function (err, num) {
                //         if (err) throw err;
                //         sdata._id = num + 1;

                //         db.collection('users').insertOne(sdata, function (err) {
                //             if (err) throw err;
                //             cb(null);
                //             client.close();
                //         });
                //     });
                // } else {
                //     cb(new Error("已经注册过了"));
                //     client.close();
                // }
            });
        });
    }
}
module.exports = usersModel;