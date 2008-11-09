jQuery.fn.extend({modal:function(_1){
var jQ=jQuery;
var _1=_1;
return this.each(function(){
jQ(this).click(function(){
var _3=$(this);
ie6=jQ.browser.msie&&(jQ.browser.version=="6.0");
if(!jQ("#modal_overlay").length){
jQ("body").append("<div id=\"modal_overlay\"></div>");
}
jQ("#modal_overlay").css({height:"100%",width:"100%",position:"fixed",left:0,top:0,"z-index":1000,opacity:50/100});
if(!jQ("#modal_content").length){
jQ("body").append("<div id=\"modal_content\"></div>");
}
c="<div class='modal_close'><p>x</p></div>";
if(_3.attr("rel")){
div_id=$("#"+_3.attr("rel"));
div_class=$("."+_3.attr("rel"));
if(div_id.length){
c=c+div_id.html();
}else{
if(div_class.length){
c=c+div_class.html();
}
}
}else{
if(_3.attr("href")){
if(_3.attr("title")){
title=_3.attr("title");
c=c+"<h3 class='modal_title'>"+title+"</h3><img src='"+_3.attr("href")+"' alt='"+title+"' />";
}else{
c=c+"<img src='"+_3.attr("href")+"' alt='modal' />";
}
}else{
c=c+_3.html();
}
}
if(_1&&_1["modal_styles"]){
styling=_1["modal_styles"];
jQ("#modal_content").html(c).css(styling).css({display:"block",zIndex:1001});
}
jQ("#modal_content").html(c).css({display:"block",zIndex:1001});
jQ("#modal_content").load(function(){
o=jQ("#modal_overlay");
w=jQ("#modal_content");
w.css({width:$(this).css("width"),height:$(this).css("height")});
if(ie6){
$("html,body").css({height:"100%",width:"100%"});
i=$("<iframe src=\"javascript:false;document.write('');\" class=\"overlay\"></iframe>").css({opacity:0});
o.html("<p style=\"width:100%;height:100%\"/>").prepend(i);
o=o.css({position:"absolute"})[0];
for(var y in {Top:1,Left:1}){
o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");
}
}
});
if(_1&&_1["show"]){
eval(_1["show"]);
}
jQ("#modal_overlay, .modal_close").click(function(){
jQ("#modal_content").remove();
jQ("#modal_overlay").remove();
if(_1&&_1["hide"]){
eval(_1["hide"]);
}
});
return false;
});
});
}});

