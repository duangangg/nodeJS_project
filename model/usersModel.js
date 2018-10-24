//数据库处理代码
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const async = require('async');

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

            //---------------async的实现方式--------------------
            async.series([
                function(callback){
                    //查询是否已经注册
                    db.collection('users').find({username:sdata.username}).count(function(err,num){
                        if(err){
                            callback({code: -101, msg: '查询是否注册失败'});
                        }else if( num !==0){
                            console.log('用户已经注册');
                            callback({code: -102, msg: '用户已经注册'});
                        }else{
                            console.log('当前用户可以注册');
                            callback(null);
                        }
                    });
                },
                function(callback){
                    //写入表的所有数据条数
                    db.collection('users').find().count(function(err,num){
                        if(err){
                            callback({code: -101, msg: '查询所有记录条数失败'});
                        }else{
                            sdata._id = num+1;
                            callback(null);
                        }
                    });
                },
                function(callback){
                     //写入数据库
                    db.collection('users').insertOne(sdata,function(err){
                        if(err){
                            callback({code :-101, msg : '写入数据库失败'});
                        }else{
                            callback(null);
                        }
                    });
                }
            ],function(err,results){
                //最终回调，都会运行
                if(err){
                    console.log('上面的三步操作可能出了问题');
                    cb(err);
                }else{
                    cb(null);
                }
                client.close();
            });

            //--------------------以下是回调地狱的实现方式----------------------
            // db.collection('users').find({username: sdata.username}).count(function (err, num) {
            //     if (err) {
            //         cb({code:-101, msg:"查询用户是否注册失败"});
            //         client.close();
            //     }else if(num !==0){
            //         console.log('注册过了');
            //         cb({code:-101, msg:"用户注册过了"});
            //         client.close();
            //     }else{
            //         console.log('没有注册,可以进行注册');
            //         db.collection('users').find().count(function (err, num) {
            //             if (err){
            //                 cb({code:-101, msg:"查询用户记录条数失败"});
            //                 client.close();
            //             }else{
            //                  sdata._id = num + 1;
            //             console.log(sdata);
            //             db.collection('users').insertOne(sdata, function (err) {
            //                 if (err) {
            //                     cb({code:-101, msg:"注册失败"});
            //                 }else{
            //                     console.log('注册成功');
            //                     cb(null);
            //                 }                          
            //                 client.close();
            //             });
            //             }
            //         });
            //     }
            //     // if (num === 0) {
            //     //     db.collection('users').find().count(function (err, num) {
            //     //         if (err) throw err;
            //     //         sdata._id = num + 1;

            //     //         db.collection('users').insertOne(sdata, function (err) {
            //     //             if (err) throw err;
            //     //             cb(null);
            //     //             client.close();
            //     //         });
            //     //     });
            //     // } else {
            //     //     cb(new Error("已经注册过了"));
            //     //     client.close();
            //     // }
            // });
        });
    },

    /**
     * 登录方法
     * @param {obj} data  登录信息 {username:'',password:''}
     * @param {fn} cb 回调函数
     */
    login(data,cb){
        MongoClient.connect(url,function (err,client) {
            if(err){
                cb({code: -101, msg: '数据库连接失败'});
            }else{
                const db = client.db('zhuce');
                db.collection('users').find({
                    username: data.username,
                    password: data.password
                }).toArray(function(err,data){
                    if(err){
                        console.log('查询数据库失败',err);
                        cb({code: -101,msg: err});
                        client.close();
                    }else if(data.length <=0){
                        console.log('用户不能登录');
                        cb({code:-102, msg: '用户名或密码错误'});
                    }else{
                        console.log('可以登录');
                        cb(null,{
                            username: data[0].username,
                            nickname: data[0].nickname,
                            isAdmin: data[0].is_admin
                        });
                    }
                    client.close();
                });
            }
        });
    },

    /**
     * 获取用户列表
     * @param {obj} data 页码信息与每页显示条数
     * @param {fn} cb  回调函数
     */
    getUserList(data,cb){
        MongoClient.connect(url,function(err,client){
            if(err){
                cb({code:-100,msg:'连接数据库失败'});
            }else{
                var db=client.db("zhuce");
                var skipNum = data.page * data.pageSize - data.pageSize;
                var limitNum = parseInt(data.pageSize);

                async.parallel([
                    function(callback){
                        //查询所有记录
                        db.collection('users').find().count(function(err,num){
                            if(err){
                                callback({code: -101 , msg: '查询数据库失败'});
                            }else{
                                callback(null,num);
                            }
                        });
                    },
                    function(callback){
                        //查询分页数据
                        db.collection('users').find().limit(limitNum).skip(skipNum).toArray(function(err,data){
                                if(err){
                                    callback({code: -101 , msg: '查询数据库失败'});
                                }else{
                                    callback(null,data);
                                }
                            });
                    }
                ],function(err,results){
                    if(err){
                        cb(err);
                    }else{
                        cb(null,{
                            totalPage: Math.ceil(results[0]/data.pageSize),
                            userList:results[1],
                            page: data.page,
                        });
                    }

                    client.close();
                });

                // db.collection('users').find().limit(data.pageSize).skip(skipNum).toArray(function(err,data){
                //     if(err){
                //         cb({code: -101 , msg: '查询数据库失败'});
                //     }else{
                //         cb(null,{});
                //     }
                // });
            }
        });

        
    }

}
module.exports = usersModel;