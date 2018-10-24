var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //判断是否已经登录
  if(req.cookies.username){
    res.render('index',{title: 'Express'});
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
})
module.exports = router;
