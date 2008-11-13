(function($){
$.fn.modal=function(_2){
return this.each(function(){
if(this._modal){
return;
}
if(typeof (_2)!="undefined"){
var _3=$.extend({},$.fn.modal.defaults,_2);
}else{
var _3=$.fn.modal.defaults;
}
if(typeof (modal_count)=="undefined"){
modal_count=0;
}
modal_count++;
this._modal=modal_count;
H[modal_count]={config:_3,target_modal:this};
$(this).modal_add_show(this);
});
};
$.fn.modal_add_show=function(_5){
return $.modal.show(_5);
};
$.fn.modal_show=function(){
return this.each(function(){
$.modal.open(this);
});
};
$.fn.modal_hide=function(){
return this.each(function(){
$.modal.hide(this);
});
};
$.fn.modal.defaults={show:false,hide:false,modal_styles:false};
$.modal={hash:{},show:function(_6){
var _7=_6._modal;
var jQ=jQuery;
var h=H[_7];
jQ(h.target_modal).click(function(){
$.modal.open(_6);
return false;
});
return false;
},hide:function(_a){
var jQ=jQuery;
jQ("#modal_overlay, .modal_close").click(function(){
jQ("#modal_content").remove();
jQ("#modal_overlay").remove();
var _c=_a._modal;
var h=H[_c];
if(h.config.hide){
eval(h.config.hide);
}
return false;
});
},open:function(_e){
var jQ=jQuery;
var pos=_e._modal;
var h=H[pos];
$.modal.insert_overlay();
$.modal.insert_content_container();
var _12=$.modal.get_content($(h.target_modal));
jQ("#modal_content").html(_12);
if(h.config.modal_styles){
jQ("#modal_content").css(h.config.modal_styles);
}
jQ("#modal_content").css({display:"block",zIndex:1001});
$.modal.for_ie(jQ("#modal_overlay"));
if(h.config.show){
eval(h.config.show);
}
$.modal.hide(_e);
},insert_overlay:function(){
var jQ=jQuery;
if(!jQ("#modal_overlay").length){
jQ("body").append("<div id=\"modal_overlay\"></div>");
}
jQ("#modal_overlay").css({height:"100%",width:"100%",position:"fixed",left:0,top:0,"z-index":1000,opacity:50/100});
},insert_content_container:function(){
var jQ=jQuery;
if(!jQ("#modal_content").length){
jQ("body").append("<div id=\"modal_content\"></div>");
}
},get_content:function(_15){
var jQ=jQuery;
c="<div class='modal_close'><p>x</p></div>";
if(_15.attr("rel")){
div_id=jQ("#"+_15.attr("rel"));
div_class=jQ("."+_15.attr("rel"));
if(div_id.length){
c+=div_id.html();
}else{
if(div_class.length){
c+=div_class.html();
}
}
}else{
if(_15.attr("href")){
if(_15.attr("title")){
c+="<h3 class='modal_title'>"+_15.attr("title")+"</h3><img src='"+_15.attr("href")+"' alt='"+_15.attr("title")+"' />";
}else{
c+="<img src='"+_15.attr("href")+"' alt='modal' />";
}
}else{
c=c+_15.html();
}
}
return c;
},for_ie:function(o){
if(ie6&&$("html,body").css({height:"100%",width:"100%"})&&o){
$("html,body").css({height:"100%",width:"100%"});
i=$("<iframe src=\"javascript:false;document.write('');\" class=\"overlay\"></iframe>").css({opacity:0});
o.html("<p style=\"width:100%;height:100%\"/>").prepend(i);
o=o.css({position:"absolute"})[0];
for(var y in {Top:1,Left:1}){
o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");
}
}
}};
var H=$.modal.hash,ie6=$.browser.msie&&($.browser.version=="6.0");
})(jQuery);

