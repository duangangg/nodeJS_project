var express = require('express');
var router = express.Router();
const usersModel = require("../model/usersModel.js");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//注册页面
// router.get('/register',function(req,res){
//   res.render('register');
// });

//注册处理
router.post('/register', function (req, res) {
  console.log('获取传递过来的post请求的数据');
  console.log(req.body);
  if (!/^\w{5,10}$/.test(req.body.username)) {
    res.render('werror', {
      code: -1,
      msg: '用户名必须是5-10位字符'
    })
    return;
  }


  //数据库写入信息
  // try {
  //   usersModel.add(req.body, function (err) {
  //     if (err) throw err;
  //     res.render('login');
  //   })
  // } catch (error) {
  //   console.log(error);
  //   res.render('werror', {
  //     code: -1,
  //     msg: 'error'
  //   })
  // }
  usersModel.add(req.body, function (err) {
    if (err) {
      res.render('werror', err);
    } else {
      // res.render('login');
      res.redirect('/login.html');
    }
  });

});

//登录处理
router.post('/login',function(req,res){
  usersModel.login(req.body,function(err,data){
    if(err){
      res.render('werror',err);
    }else{
      //跳转首页
      console.log('登录用户信息是',data);

      //写cookie
      res.cookie('username',data.username,{
        maxAge: 1000 *60*10,
      });
      res.cookie('nickname',data.nickname,{
        maxAge: 1000 *60*10,
      });
      res.cookie('isAdmin',data.isAdmin,{
        maxAge: 1000 *60*10,
      });

      res.redirect('/');
    }
  });
});

module.exports = router;