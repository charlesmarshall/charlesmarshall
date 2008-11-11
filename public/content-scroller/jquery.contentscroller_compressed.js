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
var _c=0;
jQ(this).css("overflow","hidden");
_9="<ul id=\""+_6.replace("#","")+"\"><li class=\"previous\"><a href=\"#\" class=\"previous_button\" rel=\"previous\" name=\"scroll_item_1\">&laquo;</a></li>";
var _d=0;
jQ(this).find(_5).each(function(){
jQ(this).css("position","relative");
jQ(this).css("left",((_a)*_b)+"px");
if(_d>0){
jQ(this).css("top","-"+_d+"px");
}
jQ(this).addClass("scroll_item_"+(_a+1));
_9+="<li class=\"page\"><a href=\"#\" name=\"scroll_item_"+(_a+1)+"\" class=\"page\" rel=\"page\">"+(_a+1)+"</a></li>";
_a++;
_d+=jQ(this).outerHeight();
if(jQ(this).outerHeight()>_c){
_c=jQ(this).outerHeight();
}
});
jQ(this).parent().css("height",((jQ(this).parent().outerHeight()-_d)+_c)+"px");
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
if(_1&&typeof (_1["before"])!="undefined"){
eval(_1["before"]);
}
var _f=parseInt(jQ(this).attr("name").replace("scroll_item_",""));
if(_f>0){
for(i=1;i<_f;i++){
jQ(_4).find(".scroll_item_"+i).animate({"left":"-"+((_f-i)*_b)+"px"},_7);
}
if(_1&&typeof (_1["after"])!="undefined"){
jQ(_4).find(".scroll_item_"+_f).animate({"left":"0"},_7,function(e){
eval(_1["after"]);
});
}else{
jQ(_4).find(".scroll_item_"+_f).animate({"left":"0"},_7);
}
for(i=_f+1;i<=_a;i++){
jQ(_4).find(".scroll_item_"+i).animate({"left":((_f+i)*_b)+"px"},_7);
}
}
jQ(_6+" li").removeClass("disabled");
if(_f+1<=_a){
var _11=_f+1;
}else{
var _11=_a;
jQ(_6+" li.next").addClass("disabled");
}
if(_f>1){
var _12=_f-1;
}else{
var _12=1;
jQ(_6+" li.previous").addClass("disabled");
}
jQ(_6+" li.previous a").attr("name",_12);
jQ(_6+" li.next a").attr("name",_11);
_3=_f;
return false;
});
});
}});

