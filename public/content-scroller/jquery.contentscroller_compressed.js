jQuery.fn.extend({contentscroller:function(_1){
var jQ=jQuery;
return this.each(function(){
var _3=1;
var _4=this;
if(_1&&typeof (_1["pages"])=="string"){
var _5=_1["pages"];
}else{
var _5=".page";
}
if(_1&&typeof (_1["control"])=="string"){
var _6=_1["control"];
}else{
var _6="#controls";
}
if(_1&&typeof (_1["transition_speed"])!="undefined"){
var _7=_1["transition_speed"];
}else{
var _7="slow";
}
var _8=jQ(_6).length;
var _9="";
var _a=0;
var _b=jQ(this).width();
jQ(this).css("overflow","hidden");
_9="<ul id=\""+_6.replace("#","")+"\"><li class=\"previous\"><a href=\"#\" class=\"previous_button\" rel=\"previous\" name=\"scroll_item_1\">&laquo;</a></li>";
var _c=0;
jQ(this).find(_5).each(function(){
jQ(this).css("position","relative");
jQ(this).css("left",((_a)*_b)+"px");
if(_c>0){
jQ(this).css("top","-"+_c+"px");
}
jQ(this).addClass("scroll_item_"+(_a+1));
_9+="<li class=\"page\"><a href=\"#\" name=\"scroll_item_"+(_a+1)+"\" class=\"page\" rel=\"page\">"+(_a+1)+"</a></li>";
_a++;
_c+=jQ(this).outerHeight();
});
_9+="<li class=\"next\"><a href=\"#\" class=\"next_button\" rel=\"next\" name=\"scroll_item_2\">&raquo;</a></li></ul>";
if(!jQ(_6).length){
jQ(this).before(_9);
}
if(_a==0){
jQ(_6).css("display","none");
jQ(_6+" .next").addClass("disabled");
}else{
jQ(_6+" .previous").addClass("disabled");
}
jQ(_6+" .next a").attr("rel","next");
jQ(_6+" .previous a").attr("rel","previous");
jQ(_6+" a").click(function(e){
var _e=parseInt(jQ(this).attr("name").replace("scroll_item_",""));
if(_e>0){
for(i=1;i<_e;i++){
jQ(".scroll_item_"+i).animate({"left":"-"+((_e-i)*_b)+"px"},_7);
}
jQ(".scroll_item_"+_e).animate({"left":"0"},_7);
for(i=_e+1;i<=_a;i++){
jQ(".scroll_item_"+i).animate({"left":((_e+i)*_b)+"px"},_7);
}
}
if(_e+1<=_a){
var _f=_e+1;
}else{
var _f=_a;
}
if(_e>1){
var _10=_e-1;
}else{
var _10=1;
}
jQ(_6+" li.previous a").attr("name",_10);
jQ(_6+" li.next a").attr("name",_f);
_3=_e;
return false;
});
});
}});

