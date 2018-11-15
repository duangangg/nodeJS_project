$(function(){
    $('.menu_item').children().click(function(){
        $(this).parent().css("background","yellow").siblings().css("background","#aaaaee");
    });
});