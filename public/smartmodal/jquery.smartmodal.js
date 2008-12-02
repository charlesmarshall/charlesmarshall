(function($) {
	//base function to call and setup everything
	$.fn.modal=function(options){
		return this.each(function(){			
			if(this._modal) return; //if already a modal return
			if(typeof(options) != "undefined")	var params = $.extend({}, $.fn.modal.defaults, options); //if some options are passed in merge them
			else var params = $.fn.modal.defaults;
			if(typeof(modal_count) == "undefined") modal_count=0; //set the counter to 0
			modal_count++;
			this._modal=modal_count; //set what modal number this is
			H[modal_count] = {config:params,target_modal:this}; //add to hash var
			$(this).modal_add_show(this); //add show & hide triggers
		});
	}	
	$.fn.modal_add_show=function(ele){ return $.modal.show(ele); }	
	//extra function so show & hide can be called
	$.fn.modal_show=function(){
		return this.each(function(){
			$.modal.open(this);
		});		
	}
	$.fn.modal_hide=function(){
		return this.each(function(){
			$.modal.hide(this);
		});		
	}
	//the default config vars
	$.fn.modal.defaults = {show:false, hide:false, modal_styles:false,resize:false};
	//the over riden stuff
	$.modal = {
		hash:{}, //the hash used to store all the configs & targets
		show:function(ele){
			var pos = ele._modal;
			var h = H[pos];
			jQ(h.target_modal).click(function(){
				$.modal.open(ele);
				return false;
			});
			return false;
		},
		
		hide:function(ele){
			jQ("#modal_overlay, .modal_close").click(function(){
        jQ("#modal_content").remove();
				jQ("#modal_overlay").remove();
				var pos = ele._modal;
				var h = H[pos];				
				if(h.config.hide)	eval(h.config.hide);
				return false;
      });
		},
		open:function(ele){
			var pos = ele._modal;
			var h = H[pos];
			
			$.modal.insert_overlay();
			$.modal.insert_content_container();
			var content = $.modal.get_content($(h.target_modal));
			jQ("#modal_content").html(content);
			if(h.config.modal_styles) jQ("#modal_content").css(h.config.modal_styles);
			jQ("#modal_content").css({display:"block", zIndex:1001});			
			if(h.config.resize) jQ("#modal_content img").load(function(){$.modal.resize();});
      $.modal.for_ie(jQ("#modal_overlay"));	
			if(h.config.show) eval(h.config.show);
			$.modal.hide(ele); //add hiding
		},
		insert_overlay:function(){
			if(!jQ('#modal_overlay').length) jQ("body").append('<div id="modal_overlay"></div>');
      jQ("#modal_overlay").css({height:'100%',width:'100%',position:'fixed',left:0,top:0,'z-index':1000,opacity:50/100});
		},
		insert_content_container:function(){
			var jQ = jQuery;
			if(!jQ('#modal_content').length) jQ("body").append('<div id="modal_content"></div>');
		},
		resize:function(){
			var dw =0, dh=0;
			jQ("#modal_content").children().each(function(){
				if(jQ(this).outerWidth() > dw) dw = jQ(this).outerWidth();
				if(jQ(this).outerHeight() > dh) dh = jQ(this).outerHeight();
			});
			jQ('#modal_content').css('width', dw+'px').css('margin-left', "-"+(dw/2)+'px');
		},
		get_content:function(trig){
			c = "<div class='modal_close'><p>x</p></div>";
			if(trig.attr("rel")){ //if rel exists
				div_id = jQ('#'+trig.attr('rel'));
				div_class = jQ('.'+trig.attr('rel'));	
				if(div_id.length){ c += div_id.html();}
				else if(div_class.length){ c += div_class.html();}
			}else if(trig.attr('href')){ //if it has a href but no rel then insert the href as image src
				if(trig.attr('title')){ 
					c +="<h3 class='modal_title'>"+trig.attr('title')+"</h3><img src='"+trig.attr('href')+"' alt='"+trig.attr('title')+"' />"; 	
				}else{ c += "<img src='"+trig.attr('href')+"' alt='modal' />";	}
			}else{ c = c + trig.html(); }
			return c;
		},
		for_ie:function(o){
			if(ie6&&$('html,body').css({height:'100%',width:'100%'})&&o){
				$('html,body').css({height:'100%',width:'100%'});
        i=$('<iframe src="javascript:false;document.write(\'\');" class="overlay"></iframe>').css({opacity:0});
        o.html('<p style="width:100%;height:100%"/>').prepend(i)
        o = o.css({position:'absolute'})[0];
        for(var y in {Top:1,Left:1}) o.style.setExpression(y.toLowerCase(),"(_=(document.documentElement.scroll"+y+" || document.body.scroll"+y+"))+'px'");
			}
		}
	}
	var jQ = jQuery,H=$.modal.hash,	ie6=$.browser.msie&&($.browser.version == "6.0");
})(jQuery);