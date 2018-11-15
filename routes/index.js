var express = require('express');
var router = express.Router();
var usersModel = require('../model/usersModel.js');

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
    //查询数据库，取得页码和每页显示的条数
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 5;
    usersModel.getUserList({
      page : page,
      pageSize : pageSize
    },function(err,data){
      if(err){
        res.render('werror',err);
      }else{
        res.render('user-manager',{
          username:req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin : parseInt(req.cookies.isAdmin) ? '(管理员)' : '',
          userList : data.userList,
          totalPage : data.totalPage,
          page : data.page
        });
      }
    });

    


    // res.render('user-manager',{
    //   username:req.cookies.username,
    //   nickname: req.cookies.nickname,
    //   isAdmin : parseInt(req.cookies.isAdmin) ? '(管理员)' : ''
    // });
  }else{
    res.redirect('/login.html');
  }
});

//手机管理
router.get('/mobile-manager.html',function(req,res){
  if(req.cookies.username && parseInt(req.cookies.isAdmin)){
    // res.render('mobile-manager');
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 5;
    usersModel.getPhoneList({
      page : page,
      pageSize : pageSize
    },function(err,data){
      if(err){
        res.render('werror',err);
      }else{
        res.render('mobile-manager',{
          username:req.cookies.username,
          nickname: req.cookies.nickname,
          isAdmin : parseInt(req.cookies.isAdmin) ? '(管理员)' : ''
          // userList : data.userList,
          // totalPage : data.totalPage,
          // page : data.page
        });
      }
    });

  }else{
    res.redirect('/login.html');
  }
});


module.exports = router;
