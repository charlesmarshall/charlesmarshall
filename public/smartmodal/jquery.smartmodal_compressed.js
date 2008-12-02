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
$.fn.modal.defaults={show:false,hide:false,modal_styles:false,resize:false};
$.modal={hash:{},show:function(_6){
var _7=_6._modal;
var h=H[_7];
jQ(h.target_modal).click(function(){
$.modal.open(_6);
return false;
});
return false;
},hide:function(_9){
jQ("#modal_overlay, .modal_close").click(function(){
jQ("#modal_content").remove();
jQ("#modal_overlay").remove();
var _b=_9._modal;
var h=H[_b];
if(h.config.hide){
eval(h.config.hide);
}
return false;
});
},open:function(_d){
var _e=_d._modal;
var h=H[_e];
$.modal.insert_overlay();
$.modal.insert_content_container();
var _10=$.modal.get_content($(h.target_modal));
jQ("#modal_content").html(_10);
if(h.config.modal_styles){
jQ("#modal_content").css(h.config.modal_styles);
}
jQ("#modal_content").css({display:"block",zIndex:1001});
if(h.config.resize){
jQ("#modal_content img").load(function(){
$.modal.resize();
});
}
$.modal.for_ie(jQ("#modal_overlay"));
if(h.config.show){
eval(h.config.show);
}
$.modal.hide(_d);
},insert_overlay:function(){
if(!jQ("#modal_overlay").length){
jQ("body").append("<div id=\"modal_overlay\"></div>");
}
jQ("#modal_overlay").css({height:"100%",width:"100%",position:"fixed",left:0,top:0,"z-index":1000,opacity:50/100});
},insert_content_container:function(){
var jQ=jQuery;
if(!jQ("#modal_content").length){
jQ("body").append("<div id=\"modal_content\"></div>");
}
},resize:function(){
var dw=0,dh=0;
jQ("#modal_content").children().each(function(){
if(jQ(this).outerWidth()>dw){
dw=jQ(this).outerWidth();
}
if(jQ(this).outerHeight()>dh){
dh=jQ(this).outerHeight();
}
});
jQ("#modal_content").css("width",dw+"px").css("margin-left","-"+(dw/2)+"px");
},get_content:function(_14){
c="<div class='modal_close'><p>x</p></div>";
if(_14.attr("rel")){
div_id=jQ("#"+_14.attr("rel"));
div_class=jQ("."+_14.attr("rel"));
if(div_id.length){
c+=div_id.html();
}else{
if(div_class.length){
c+=div_class.html();
}
}
}else{
if(_14.attr("href")){
if(_14.attr("title")){
c+="<h3 class='modal_title'>"+_14.attr("title")+"</h3><img src='"+_14.attr("href")+"' alt='"+_14.attr("title")+"' />";
}else{
c+="<img src='"+_14.attr("href")+"' alt='modal' />";
}
}else{
c=c+_14.html();
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
var jQ=jQuery,H=$.modal.hash,ie6=$.browser.msie&&($.browser.version=="6.0");
})(jQuery);

