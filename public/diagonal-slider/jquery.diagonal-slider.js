(function($) {
	$.fn.diagonalslider = function(options){		
		params = $.extend({}, $.fn.diagonalslider.defaults, options);
		return this.each(function(){
			if(this._diagonalslider > 0) return;
			elecount++;
			H[elecount] = {target:this, params:params, overlay_postions:{}};
			jQ(params['overlays'].moving).each(function(){
				this._dsoleft = parseInt(jQ(this).css('left').replace('px',''));
			});
			jQ(this).find(params['contents']).each(function(){
				$.diagonalslider.addtargets(this,params['angle'], params['targetsize'], params['triggers']);
				$.diagonalslider.hoveraction(this, params['items'], params['angle'],params['overlays'], params['closer'], params['targetsize']);
			});
			
		});
	}
	
	$.diagonalslider = {
		hash:{},
		addtargets:function(target, angle, size, trigger){
			var h=jQ(target).outerHeight(), w=jQ(target).outerWidth(),tw=jQ(trigger).outerWidth(), multi=(angle/90), offsetx=((w*multi)+tw)-size, targets=Math.round(h/size), offseth = jQ(target).eq(0).offset().top;
			for(i=0;i<targets;i++){
				jQ(target).prepend("<div class='hover_status' style='position:absolute;top:"+((i*size)+offseth)+"px;left:"+(((i*size)+offsetx)-size)+"px;height:"+size+"px;width:"+(size)+"px;'>&nbsp;</div>"); 
				jQ(target).prepend("<div class='hover_target' style='position:absolute;top:"+((i*size)+offseth)+"px;left:"+((i*size)+offsetx)+"px;height:"+size+"px;width:"+(size)+"px;'>&nbsp;</div>"); //main block
				jQ(target).prepend("<div class='hover_status' style='position:absolute;top:"+((i*size)+offseth)+"px;left:"+(((i*size)+offsetx)+size)+"px;height:"+size+"px;width:"+(size)+"px;'>&nbsp;</div>"); //main block
			}
		},
		hoveraction:function(target, items, angle,overlays, closer, size){
			var moveable = overlays['moving'], w=(jQ(target).outerWidth()*0.75),multi=(angle/90);
			//setup the hover motion, so on hover it expands
			jQ(target).find('.hover_target').hover(
				function(){
					jQ(moveable).each(function(){						
						jQ(this).animate({'left':(w+this._dsoleft)+'px'});
						jQ(target).find(items).css('padding-left', (w/3)+'px');
						var item_counter=0;
						jQ(target).find(items).find('*').each(function(){
							var t= jQ(this).eq(0).offset().top;
							jQ(this).css('padding-left', (t)+'px');
							item_counter++;
						});
					});
				}, 
				function(){}
			);	
			//do nothing on individuals
			jQ(items).hover(function(){}, function(){});	
			//on hover close it
			jQ(closer).hover(
				function(){}, 
				function(){
					jQ(moveable).each(function(){
						jQ(this).animate({'left':(this._dsoleft)+'px'});	
						jQ(target).find(items).css('padding-left', '0px');					
					});
				}
			);
		}
	};
	
	$.fn.diagonalslider.defaults = {start:1,items:'.item', triggers: '#triggers', closer:'body',contents:'#contents', angle:45,speed: 'slow', targetsize:100, overlays:{fixed:'#diagonal_overlay_1', moving:'#diagonal_overlay_2'} };
	var jQ = jQuery, dsoleft=0,params, elecount=0,H=$.diagonalslider.hash,	ie6=$.browser.msie&&($.browser.version == "6.0");;
	
})(jQuery);