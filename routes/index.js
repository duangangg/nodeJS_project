var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //判断是否已经登录
  if(req.cookies.username){
    res.render('index',{
      username:req.cookies.username,
      nickname: req.cookies.nickname,
      isAdmin : parseInt(req.cookies.isAdmin) ? '(管理员)' : ''
    });
  }else{
    //跳转到登录界面
    res.redirect('/login.html');
  }


  res.render('index', { title: 'Express' });
});

//注册页面
router.get('/register.html',function(req,res){
  res.render('register');
});

//登录
router.get('/login.html',function(req,res){
  res.render('login');
});

//用户管理
router.get('/user-manager.html',function(req,res){
  if(req.cookies.username && parseInt(req.cookies.isAdmin)){
    res.render('user-manager');
  }else{
    res.redirect('/login.html');
  }
});

//手机管理
router.get('/mobile-manager.html',function(req,res){
  if(req.cookies.username && parseInt(req.cookies.isAdmin)){
    res.render('mobile-manager');
  }else{
    res.redirect('/login.html');
  }
});


module.exports = router;
