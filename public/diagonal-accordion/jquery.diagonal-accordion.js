(function($) {
	/* your typical accordion, but at 45 degrees!*/
	$.fn.diagonalaccordion = function(options){		
		/*merge the params*/
		params = $.extend({}, $.fn.diagonalaccordion.defaults, options);
		return this.each(function(){
			//already in use so return
			if(this._diagaccord>0) return;
			var barcount=0; //accordion item counter
			elecount++; //global counter
			H[elecount] = {container:this, open:false, params:params, items:{}, toppos:jQ(this).eq(0).offset().top, cwidth:jQ(this).outerWidth(), cheight:jQ(this).outerHeight(), barcount:0}; //hash data
			this._diagaccord = elecount; //assign info
			jQ(this).find(params['accordion']).each(function(){ //loop
				if(typeof(this._digbar) == 'undefined'){
					barcount++;//increase counter
					this._digbar=barcount; //add it to the item
					this._accopen = false;
					jQ(this).addClass('accordion_item_'+barcount); //give it a class
					H[elecount].items[barcount] = this; //add this to the hash
					jQ(this).css('display', 'none'); //hide the content
					$.diagonalaccordion.addbar(elecount,this); //add the bar - for visuals
					$.diagonalaccordion.addtargets(elecount, this); //add the targets		
				}
			});
			H[elecount].barcount = barcount;//add the total accordions
			jQ(this).find('.hover_target').each(function(){ //when hovering over a target do this stuff
				jQ(this).hover(
					function(){$.diagonalaccordion.onhover(elecount, this);},function(){}
				);
			});
			if(params['start']) $.diagonalaccordion.slide(elecount, params['start']); //if passed in then open at a certain point
		});
	}
	
	$.diagonalaccordion = {
		hash:{},//data
		addbar:function(elenum,bar){ //create a div with bar graphics 
			var h = H[elenum], container=h.container, params=h.params, barnum = bar._digbar; //local vars
			var offsetx = jQ(container).eq(0).offset().left+(params.bar_size *(barnum-1)); //work out position of this bars x
			var offsety = h.toppos; //and y
			jQ(container).prepend("<div class='acc_bar bar_"+barnum+"' style='position:absolute;width:"+params.acc_width+"px;height:"+params.acc_height+"px;top:"+offsety+"px;left:"+offsetx+"px;z-index:"+(barnum+10)+";'>&nbsp;</div>"); //create divs
		},
		addtargets:function(elenum, bar){ //make the target divs..
			var h = H[elenum], params=h.params, container=h.container,barnum = bar._digbar, zindex=(900+barnum), size=params.bar_size; //local vars
			var offsetx = jQ(container).eq(0).offset().left+(params.bar_size*(barnum-1)); //position to start at
			var offsety = h.toppos;
			var numtargets = Math.round((h.cheight/size)*params.coverage); //the coverage param used to manipulate how many targets to use
			for(i=0;i<numtargets;i++){ //loop around
				var tp = ((i*size/params.coverage)+offsety),lp = ((i*(size/params.coverage))+offsetx+(size/params.coverage)); //work out y & x
				jQ(container).prepend("<div class='hover_target target_"+barnum+"' rel='"+barnum+"' style='z-index:"+zindex+";position:absolute;top:"+tp+"px;left:"+lp+"px;height:"+(size/params.coverage)+"px;width:"+(size*0.75)+"px;'>&nbsp;</div>"); //main block
			}
		},
		onhover:function(elenum, target){
			$.diagonalaccordion.slide(elenum, jQ(target).attr('rel'));
		},
		slide:function(elenum, accbar){ //slide the bar in in & out
			var h = H[elenum], params=h.params, container=h.container, accordion = h.items[accbar], ac_count = h.barcount, awidth=params.acc_width;
			var offsetx = jQ(container).eq(0).offset().left+(params.bar_size*(accbar-1)), newbar=parseInt(accbar);
			if(!h.open){ //not open, so open it
				for(i=newbar+1; i<=ac_count;i++) jQ(container).find('.target_'+i+', .bar_'+i).animate({left:'+='+awidth+'px'},h.speed);
			}else if(newbar > h.open){
				for(i=newbar; i>h.open;i--) jQ(container).find('.target_'+i.toString()+', .bar_'+i).animate({left:'-='+awidth+'px'},h.speed);
			}else if(newbar < h.open){
				for(i=h.open; i>newbar;i--) jQ(container).find('.target_'+i+', .bar_'+i).animate({left:'+='+awidth+'px'},h.speed);
			}
			jQ(container).children(params.accordion).css('display', 'none'); //hide all the accordions
			
			jQ(container).children('.accordion_item_'+newbar).css('display', 'block').css('margin-left', newbar*params.bar_size+'px'); //move the accordion over to right place
			var ci=1; //counter
			jQ(container).children('.accordion_item_'+newbar).css('display', 'block').children('p,h1,h2,h3,h4,h5,h6,li').each(function(){ //add padding to child block elements
				jQ(this).css('padding-left', ((ci*2)*(params.bar_size/2)+params.bar_size)+'px').css('padding-right', ((ci*2)*(params.bar_size/2)+params.bar_size)+'px').css('z-index',500).css('position','relative');
				ci++;
			});
			h.open = newbar; //copy over to h.open			
		}
	};
	
	$.fn.diagonalaccordion.defaults = {start:false,acc_width:500, acc_height:300,bar_size:45, speed:'slow', accordion:'.accordion', coverage:4}; //the coverage var improves the amount of targets overlaying the bar - but effects performance
	var jQ = jQuery, params, elecount=0,H=$.diagonalaccordion.hash;
	
})(jQuery);