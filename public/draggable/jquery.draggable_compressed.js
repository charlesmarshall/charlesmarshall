jQuery.fn.extend({drag:function(_1){
var jQ=jQuery;
return this.each(function(){
var _3=false;
var _4;
var _5;
var _6=this;
bgimg=$("#"+this.id+" img");
imgx=bgimg.width();
imgy=bgimg.height();
$(this).css("background","url('"+bgimg.attr("src")+"') no-repeat center center");
bgimg.css("display","none");
$(this).mousedown(function(e){
$(this).css("cursor","move");
_3=true;
_4=Math.round(e.pageX-$(this).eq(0).offset().left);
_5=Math.round(e.pageY-$(this).eq(0).offset().top);
});
$(this).mouseup(function(e){
$(this).css("cursor","default");
_3=false;
});
$(this).mousemove(function(e){
if(_3){
bg=$(this).css("background-position");
if(bg.indexOf("%")>1){
leftpos=($(this).width()/2)-(imgx/2);
toppos=($(this).height()/2)-(imgy/2);
}else{
bg=bg.replace("px","").replace("px","").split(" ");
leftpos=parseInt(bg[0]);
toppos=parseInt(bg[1]);
}
var _a=Math.round(e.pageX-$(this).eq(0).offset().left)-_4;
var _b=Math.round(e.pageY-$(this).eq(0).offset().top)-_5;
var x=leftpos+(_a);
var y=toppos+(_b);
_4=Math.round(e.pageX-$(this).eq(0).offset().left);
_5=Math.round(e.pageY-$(this).eq(0).offset().top);
$(_6).css("background-position",x+"px "+y+"px");
}
});
});
}});

