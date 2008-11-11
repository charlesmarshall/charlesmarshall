jQuery.fn.extend({resize:function(_1){
var jQ=jQuery;
return this.each(function(){
var _3=false;
var _4;
var _5;
if(_1&&_1["target"]){
var _6=_1["target"];
}else{
var _6=this;
}
if(_1&&typeof (_1["y"])!="undefined"){
var y=_1["y"];
}else{
var y=1;
}
if(_1&&typeof (_1["x"])!="undefined"){
var x=_1["x"];
}else{
var x=1;
}
if(_1&&typeof (_1["min_width"])!="undefined"){
var _9=_1["min_width"];
}else{
var _9=1;
}
if(_1&&typeof (_1["min_height"])!="undefined"){
var _a=_1["min_height"];
}else{
var _a=1;
}
$(this).hover(function(){
$(this).css("cursor","move");
},function(){
$(this).css("cursor","default");
_3=false;
});
$(this).mousedown(function(e){
_3=true;
_4=Math.round(e.pageX-$(this).eq(0).offset().left);
_5=Math.round(e.pageY-$(this).eq(0).offset().top);
});
$(this).mouseup(function(e){
_3=false;
});
$(this).mousemove(function(e){
if(_3){
var _e=Math.round(e.pageX-$(this).eq(0).offset().left)-_4;
var _f=Math.round(e.pageY-$(this).eq(0).offset().top)-_5;
var _10=$(_6).width();
var _11=$(_6).height();
var _12=parseInt(_10)+_e;
var _13=parseInt(_11)+_f;
if(x==1||(typeof (x)=="number"&&_12<x&&_12>_9)){
$(_6).css("width",_12+"px");
}
if(y==1||(typeof (y)=="number"&&_13<y&&_13>_a)){
$(_6).css("height",_13+"px");
}
_4=Math.round(e.pageX-$(this).eq(0).offset().left);
_5=Math.round(e.pageY-$(this).eq(0).offset().top);
}
});
});
}});

