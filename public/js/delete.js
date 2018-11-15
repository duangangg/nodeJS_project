$(function(){
    $('.del').click(function(){
        var ID = $(this).parent().parent().find(".id").html();
        console.log(ID);
        // console.log(typeof idNum);
        $.get('/users/delete',{
            _id:ID
        },function(res){
            if(res.code ==0){
                location.reload();
            }
        });
    });

    $('.searchbtn').click(function(){
        var name = $(".searchinp").html();
        console.log(name);
        // console.log(typeof idNum);
        $.get('/users/delete',{
            nickname:name
        },function(res){
            if(res.code ==0){
                location.reload();
            }
        });
    });

    $('.change').click(function(){
        var id = $(this).parent().parent().find(".id").html();
        var username = $(this).parent().parent().find(".username").html();
        var nikename = $(this).parent().parent().find(".nickname").html();
        var iphone = $(this).parent().parent().find(".iphone").html();
        var sex = $(this).parent().parent().find(".sex").html();
        var age = $(this).parent().parent().find(".age").html();
        
        $('.upda').show();
        $('._u_name').val(nikename);
        $('._number').val(iphone);
        $('._sex').val(sex);
        $('._age').val(age);
        $('#isId').val(id);

    });
    $('.cancel').click(function(){
        $('.upda').hide();
    });
    
})