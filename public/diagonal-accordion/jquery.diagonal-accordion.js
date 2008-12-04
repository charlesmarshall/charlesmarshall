(function($) {
	/* your typical accordion, but at 45 degrees!*/
	$.fn.diagonalaccordion = function(options){		
		params = $.extend({}, $.fn.diagonalaccordion.defaults, options);
		return this.each(function(){
			if(this._diagaccord>0) return;
			var barcount=0;
			elecount++;
			H[elecount] = {container:this, open:false, params:params, items:{}, toppos:jQ(this).eq(0).offset().top, cwidth:jQ(this).outerWidth(), cheight:jQ(this).outerHeight(), barcount:0};
			this._diagaccord = elecount;
			jQ(this).find(params['accordion']).each(function(){
				if(typeof(this._digbar) == 'undefined'){
					barcount++;//increase counter
					this._digbar=barcount; //add it to the item
					this._accopen = false;
					jQ(this).addClass('accordion_item_'+barcount); //give it a class
					H[elecount].items[barcount] = this; //add this to the hash
					jQ(this).css('display', 'none'); //hide the content
					$.diagonalaccordion.addbar(elecount,this); //add the bar - for visuals
					$.diagonalaccordion.addtargets(elecount, this);				
				}
			});
			H[elecount].barcount = barcount;
			jQ(this).find('.hover_target').each(function(){
				jQ(this).hover(
					function(){$.diagonalaccordion.onhover(elecount, this);},
					function(){}
				);
			});
			if(params['start']) $.diagonalaccordion.slide(elecount, params['start']);
		});
	}
	
	$.diagonalaccordion = {
		hash:{},
		addbar:function(elenum,bar){
			var h = H[elenum], container=h.container, params=h.params, barnum = bar._digbar;
			var offsetx = jQ(container).eq(0).offset().left+(params.bar_size *(barnum-1));
			var offsety = h.toppos;
			jQ(container).prepend("<div class='acc_bar bar_"+barnum+"' style='position:absolute;width:"+params.acc_width+"px;height:"+params.acc_height+"px;top:"+offsety+"px;left:"+offsetx+"px;z-index:"+(barnum+10)+";'>&nbsp;</div>")
		},
		addtargets:function(elenum, bar){
			var h = H[elenum], params=h.params, container=h.container,barnum = bar._digbar, zindex=(1000-barnum), size=params.bar_size;
			var offsetx = jQ(container).eq(0).offset().left+(params.bar_size*(barnum-1));
			var offsety = h.toppos;
			var numtargets = Math.ceil(h.cheight/size);
			for(i=0;i<numtargets;i++){
				jQ(container).prepend("<div class='hover_target target_"+barnum+"' rel='"+barnum+"' style='z-index:"+zindex+";position:absolute;top:"+((i*size/2)+offsety)+"px;left:"+((i*(size/2))+offsetx+(size/2))+"px;height:"+(size/2)+"px;width:"+(size/2)+"px;'>&nbsp;</div>"); //main block
			}
		},
		onhover:function(elenum, target){
			var h = H[elenum], params=h.params, container=h.container, accbar = jQ(target).attr('rel'), accordion = h.items[accbar];
			$.diagonalaccordion.slide(elenum, accbar);
		},
		slide:function(elenum, accbar){
			var h = H[elenum], params=h.params, container=h.container, accordion = h.items[accbar], ac_count = h.barcount, awidth=params.acc_width;
			var offsetx = jQ(container).eq(0).offset().left+(params.bar_size*(accbar-1));
			newbar=parseInt(accbar);
			if(!h.open){	//not open, so open it
				for(i=newbar+1; i<=ac_count;i++) jQ(container).find('.target_'+i+', .bar_'+i).animate({left:'+='+awidth+'px'},h.speed);
			}else if(newbar > h.open){
				for(i=newbar; i>h.open;i--) jQ(container).find('.target_'+i.toString()+', .bar_'+i).animate({left:'-='+awidth+'px'},h.speed);
			}else if(newbar < h.open){
				for(i=h.open; i>newbar;i--) jQ(container).find('.target_'+i+', .bar_'+i).animate({left:'+='+awidth+'px'},h.speed);
			}
			//padding to make text staggered
			jQ(container).children(params.accordion).css('display', 'none');
			//switch zindexes			
			jQ(container).find('.target_'+h.open).each(function(){
				jQ(this).css('z-index', jQ(this).css('z-index').toString().replace('-',''));
			});
			jQ(container).find('.target_'+newbar+', .acc_bar').each(function(){
				var nz = parseInt(jQ(this).css('z-index'));
				jQ(this).css('z-index', nz-(nz*2));
			});
			
			jQ(container).children('.accordion_item_'+newbar).css('display', 'block').children('p,h1,h2,h3,h4,h5,h6,li').each(function(){
				var t= jQ(this).eq(0).offset().top;
				jQ(this).css('padding-left', (t+(newbar*params.bar_size)+(params.bar_size*2))+'px').css('padding-right', params.bar_size+'px').css('z-index',200);
			});			
			h.open = newbar;			
		}
	};
	
	$.fn.diagonalaccordion.defaults = {start:false,acc_width:500, acc_height:300,bar_size:45, speed:'slow', accordion:'.accordion'};
	var jQ = jQuery, params, elecount=0,H=$.diagonalaccordion.hash,	ie6=$.browser.msie&&($.browser.version == "6.0");;
	
})(jQuery);