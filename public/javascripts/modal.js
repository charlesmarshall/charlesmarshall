jQuery.fn.extend({
  modal: function(params){
    var jQ = jQuery;
    return this.each(function(){
      jQ(this).click(function(){
        var trig = $(this);
        ie6=jQ.browser.msie&&(jQ.browser.version == "6.0")
        jQ("body").append('<div id="modal_overlay"></div>');
        jQ("#modal_overlay").css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':1000,opacity:50/100});
        jQ("body").append('<div id="modal_content"></div>');
        c = "<img src='"+trig.attr("href")+"' />";
        jQ("#modal_content").html(c).css({display:"block", zIndex:1001});
        jQ("#modal_content img").load(function() {
          o = jQ("#modal_overlay");
          w = jQ("#modal_content");
          w.css({width:$(this).css("width"), height:$(this).css("height") });
          if(ie6) {
            $('html,body').css({height:'100%',width:'100%'});
            i=$('<iframe src="javascript:false;document.write(\'\');" class="overlay"></iframe>').css({opacity:0});
            o.html('<p style="width:100%;height:100%"/>').prepend(i)
            o = o.css({position:'absolute'})[0];
            for(var y in {Top:1,Left:1}) o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");
          }
        });
        jQ("#modal_overlay").click(function(){
          jQ("#modal_content").remove();
          jQ(this).remove();
        });
        return false;
      });
    });
    
  }
});


