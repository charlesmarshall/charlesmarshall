(function($){
$.fn.contentscroller=function(_2){
var jQ=jQuery;
var _2=$.extend({},$.fn.contentscroller.defaults,_2);
return this.each(function(){
var _4=1;
var _5=this;
var _6=jQ(_2["controller"]).length;
var _7="";
var _8=0;
var _9=jQ(this).width();
var _a=0;
jQ(this).css("overflow","hidden");
_7="<ul id=\""+_2["controller"].replace("#","")+"\"><li class=\"previous\"><a href=\"#\" class=\"previous_button\" rel=\"previous\" name=\"scroll_item_1\">&laquo;</a></li>";
var _b=0;
jQ(this).find(_2["pages"]).each(function(){
jQ(this).css("position","relative");
jQ(this).css("left",((_8)*_9)+"px");
if(_b>0){
jQ(this).css("top","-"+_b+"px");
}
jQ(this).addClass("scroll_item_"+(_8+1));
_7+="<li class=\"page\"><a href=\"#\" name=\"scroll_item_"+(_8+1)+"\" class=\"page\" rel=\"page\">"+(_8+1)+"</a></li>";
_8++;
_b+=jQ(this).outerHeight();
if(jQ(this).outerHeight()>_a){
_a=jQ(this).outerHeight();
}
});
jQ(this).css("height",(_a)+"px");
_7+="<li class=\"next\"><a href=\"#\" class=\"next_button\" rel=\"next\" name=\"scroll_item_2\">&raquo;</a></li></ul>";
if(!jQ(_2["controller"]).length){
jQ(this).before(_7);
}
if(_8==0){
jQ(_2["controller"]).css("display","none");
jQ(_2["controller"]+" .next").addClass("disabled");
}else{
jQ(_2["controller"]+" .previous").addClass("disabled");
}
jQ(_2["controller"]+" a").click(function(e){
if(_2&&typeof (_2["before"])!="undefined"){
eval(_2["before"]);
}
var _d=parseInt(jQ(this).attr("name").replace("scroll_item_",""));
if(_d>0){
for(i=1;i<=_8;i++){
if(i<_d){
jQ(_5).find(".scroll_item_"+i).animate({"left":"-"+((_d-i)*_9)+"px"},_2["trans_speed"]);
}else{
if(i==_d&&_2["after"]){
jQ(_5).find(".scroll_item_"+_d).animate({"left":"0"},_2["trans_speed"],function(e){
eval(_2["after"]);
});
}else{
if(i==_d){
jQ(_5).find(".scroll_item_"+_d).animate({"left":"0"},_2["trans_speed"]);
}else{
jQ(_5).find(".scroll_item_"+i).animate({"left":((_d+i)*_9)+"px"},_2["trans_speed"]);
}
}
}
}
}
jQ(_2["controller"]+" li").removeClass("disabled");
if(_d+1<=_8){
var _f=_d+1;
}else{
var _f=_8;
jQ(_2["controller"]+" li.next").addClass("disabled");
}
if(_d>1){
var _10=_d-1;
}else{
var _10=1;
jQ(_2["controller"]+" li.previous").addClass("disabled");
}
jQ(_2["controller"]+" li.previous a").attr("name",_10);
jQ(_2["controller"]+" li.next a").attr("name",_f);
_4=_d;
return false;
});
});
};
$.fn.contentscroller.defaults={pages:".page",controller:"#controls",trans_speed:"slow",before:false,after:false};
})(jQuery);

