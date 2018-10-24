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
  if (!/^\w{3,10}$/.test(req.body.username)) {
    res.render('werror', {
      code: -1,
      msg: '用户名必须是3-10位字符'
    });
    return;
  }
  if (!/^[a-z0-9A-Z]{3,10}$/.test(req.body.password)) {
    res.render('werror', {
      code: -1,
      msg: '密码必须是3-10位字母与数字'
    });
    return;
  }
  if (!/^[a-z0-9A-Z]{3,10}$/.test(req.body.repassword)) {
    res.render('werror', {
      code: -1,
      msg: '确认密码必须是3-10位字母与数字'
    });
    return;
  }
  if (!/^1[3|4|5|7|8][0-9]{9}$/.test(req.body.phone)) {
    res.render('werror', {
      code: -1,
      msg: '手机号码错误'
    });
    return;
  }
  if (req.body.password !== req.body.repassword) {
    res.render('werror', {
      code: -1,
      msg: '两次密码不一致'
    });
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

//退出登录
router.get('/logout',function(req,res){
  res.clearCookie('username');
  res.clearCookie('nickname');
  res.clearCookie('isAdmin');

  res.redirect('/login.html');
  // location.replace('/login.html');
});

module.exports = router;