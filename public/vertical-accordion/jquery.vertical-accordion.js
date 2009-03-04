(function($) {
	/* your typical accordion, but at 45 degrees!*/
	$.fn.verticalaccordion = function(options){		
		/*merge the params*/
		params = $.extend({}, $.fn.verticalaccordion.defaults, options);
		return this.each(function(){
			if(this._vaccord>0) return;
			var barcount = 0, timeto;
			elecount ++;
			H[elecount] = {container:this, params:params, items:{}, vtoppos:jQ(this).eq(0).offset().top, vleftpos:jQ(this).eq(0).offset().left, barcount:0, open:false, moving:false, windowsize:jQ(window).width()};
			this._vaccord = elecount;
			jQ(this).find(params['accordion']).each(function(){
				if(typeof(this._vbar) == 'undefined'){ //only do this for undefined bars
					barcount ++;
					this._vbar = barcount;
					this._vopen = false;
					jQ(this).addClass('vertical-accordion').addClass('vertical-accordion-'+barcount).css('display', 'none').css('height', params['accordion_height']+'px');
					H[elecount].items[barcount] = this;					
				}
			});
			H[elecount].barcount = barcount;//add the total accordions
			$.verticalaccordion.create(params, this, elecount, timeto);
			
			jQ(params['triggers']).each(function(){
				jQ(this).click(function(){
					$.verticalaccordion.onhover(elecount, this);
					return false;
					});
			});
			jQ(window).resize(function(){
				$.verticalaccordion.resize(elecount);
			});
			if(params['start']) $.verticalaccordion.slide(elecount, params['start']); //if passed in then open at a certain point
		});
	};
	
	$.verticalaccordion = {
		hash:{},//data
		resize:function(elecount){
			var newsize = (jQ(window).width() - H[elecount].windowsize)/2;
			jQ('.vertical-accordion-bar').each(function(){
				var oldlft = parseInt(jQ(this).css('left').replace(/px/g, ''),0);
				var lft = (oldlft + newsize);					
				jQ(this).css('left', lft.toString()+'px');
			});
			H[elecount].windowsize = jQ(window).width();
		},
		create:function(params, container, elecount, timeto){
			jQ(container).find(params['accordion']).each(function(){	$.verticalaccordion.addbar(elecount, this);});
			jQ(container).find('.vertical-accordion-bar').each(function(){ //when hovering over a target do this stuff
				jQ(this).hover(function(){					
					clearTimeout(timeto);
					var idstr = "";
					if(jQ(this).attr('class')) idstr+="."+jQ(this).attr('class').replace(" ", ".").replace('vbar_active', '');
					timeto = setTimeout("$.verticalaccordion.onhover("+elecount+", '"+idstr+"');", params['timer']);
					},
					function(){clearTimeout(timeto);}
					);
			});
		},
		addbar:function(elenum,bar){ //create a div with bar graphics 
			var h = H[elenum], container=h.container, params=h.params, barnum = bar._vbar; //local vars
			var modx = params.bar_width*(h.barcount);
			var offsetx = parseInt(h.vleftpos+(params.bar_width* (barnum-1)),0);
			var offsety = h.vtoppos; //and y
			jQ(container).prepend("<div rel='bar"+barnum+"' class='vertical-accordion-bar vbar-"+barnum+"' style='position:absolute;width:"+params.bar_width+"px;height:"+params.accordion_height+"px;top:"+offsety+"px;left:"+offsetx+"px;z-index:"+(barnum+3)+";'>&nbsp;</div>"); //create divs
		},
			
		onhover:function(elenum, target){
			var newbar = parseInt(jQ(target).attr('rel').replace('bar',''),0);
			if(newbar != H[elenum].open) $.verticalaccordion.slide(elenum, newbar);
		},
		showcontent:function(elenum, newbar){			
			var h = H[elenum], params=h.params, container=h.container;
			jQ(container).children('.vertical-accordion-bar').removeClass('vbar_active');
			jQ(params['triggers']).removeClass('vbar_active');
			jQ(container).find(params.accordion).css('display', 'none');
			jQ(container).children('.vertical-accordion-'+newbar).css('display', 'block').fadeTo('slow',1);
			h.open = newbar; //copy over to h.open	
			jQ(params['triggers']+'.vbar-'+newbar).addClass('vbar_active');
			jQ(container).children('div.vbar-'+newbar+', vertical-accordion-bar-'+(newbar)+', .vertical-accordion-'+newbar).addClass('vbar_active');
			h.moving = false;
		},
		slide:function(elenum, accbar){ //slide the bar in in & out
			var h = H[elenum], params=h.params, container=h.container, accordion = h.items[accbar], ac_count = h.barcount, awidth=params.accordion_width;
			var newbar=parseInt(accbar,0);
			var modx = params.bar_width*(ac_count-1);
			if(!h.open){ //not open, so open it
				if(newbar+1 > ac_count) $.verticalaccordion.showcontent(elenum,1);
				for(i=newbar+1; i<=ac_count;i++) jQ(container).find('.vbar-'+i).animate({left:'+='+(awidth-modx)+'px'},params.speed, 'linear',setTimeout("$.verticalaccordion.showcontent("+elenum+","+ newbar+")", 500));
			}else if(newbar > h.open && !h.moving){
				h.moving = true;
				jQ(container).find(params.accordion).fadeTo('fast', 0.1);		
				for(i=newbar; i>h.open;i--) jQ(container).find('.vbar-'+i).animate({left:'-='+(awidth-modx)+'px'},params.speed,'linear',setTimeout("$.verticalaccordion.showcontent("+elenum+","+ newbar+")", 500));
			}else if(newbar < h.open && !h.moving){
				h.moving = true;
				jQ(container).find(params.accordion).fadeTo('fast', 0.1);						
				for(i=h.open; i>newbar;i--) jQ(container).find('.vbar-'+i).animate({left:'+='+(awidth-modx)+'px'},params.speed,'linear',setTimeout("$.verticalaccordion.showcontent("+elenum+","+ newbar+")", 500));
			}
			jQ(document).trigger("accordionshow");
		}
	};
	
	$.fn.verticalaccordion.defaults = {start:1,accordion_width:500, accordion_height:300,bar_width:45, speed:'slow', triggers:'#active .sub_item a', accordion:'.accordion', timer:800}; 
	var jQ = jQuery, params, elecount=0,H=$.verticalaccordion.hash;
	
})(jQuery);