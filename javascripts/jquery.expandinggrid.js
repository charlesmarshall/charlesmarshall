(function($) {
  
  $.fn.expandinggrid = function(options){
    P[usecount] = $.extend({}, $.fn.expandinggrid.defaults, options, {container:this});
    D[usecount] = {};
    return this.each(function(){
      if(this.__egrid) return;
      else this.__egrid = usecount;
      $.expandinggrid.setup(usecount);
      usecount++;
    });
  };
  
  $.fn.expandinggrid.defaults = {
                                 "columns": 3,
                                 "grid_items": 'item',
                                 "grid_space": 10,
                                 "grind_zindex":3
                               };
  
  
  $.expandinggrid = {
    data:[],
    params:[],
    fetchitems:function(position){
      return jQuery(P[position].container).children("."+P[position].grid_items);
    },
    closed_dimensions:function(position){
      var div = jQuery(P[position].container).eq(0),
          dwidth = div.outerWidth()/P[position].columns,
          dheight = div.outerHeight()/(D[position].items.length/P[position].columns);
      return {"width":dwidth, "height":dheight};
    },
    apply_dimensions:function(position, items, dimensions){
      var loop=0;
      items.each(function(){
        var margin = P[position].grid_space,
            div = jQuery(P[position].container).eq(0),
            col = loop % P[position].columns, 
            end = (loop+1) % P[position].columns, 
            row = Math.floor(loop/P[position].columns),
            dwidth = dimensions.width-P[position].grid_space,
            dheight = dimensions.height-P[position].grid_space;
        
        var pleft = jQuery(this).eq(0).offset().left+(col*dimensions.width),
            ptop = jQuery(this).eq(0).offset().top+(row*dimensions.height);
            eleinfo = {"width":dwidth, 
                       "height":dheight, 
                       "position":"absolute", 
                       "left":pleft,
                       "top":ptop,
                       "zindex":P[position].grind_zindex,
                       "row":row,
                       "col":col
                       },
            cssinfo = {"width":eleinfo.width+"px", "height":eleinfo.height+"px", "position":eleinfo.position, "left":eleinfo.left+"px", "top":eleinfo.top+"px", "z-index":eleinfo.zindex};
          
        jQuery(this).addClass("eg_row"+row+" eg_col"+col).removeClass('eg_expanded').css(cssinfo);
        jQuery(this).data('eleinfo', eleinfo);        
        loop++; 
        D[position].totals.rows=row;
      });
    },
    expand:function(position, item, dimensions, modifier){
      if(jQuery(item).hasClass('eg_expanded')) return;
      
      var info = jQuery(item).data('eleinfo');
          current_height = info.height,
          current_width = info.width,
          new_height = current_height*modifier,
          new_width = current_width*modifier,
          height_diff = new_height - current_height,
          width_diff = new_width - current_width,
          ntop = info.top,
          nleft = info.left,
          col=info.col,
          row=info.row
          ;
          
      if(row==D[position].totals.rows) ntop = ntop - height_diff;
      else if(row > 0) ntop = ntop - (height_diff/2);
      
      if(col==(D[position].totals.columns-1)) nleft = nleft - width_diff;
      else if(col > 0) nleft = nleft - (width_diff/2);

      jQuery(item).addClass("eg_expanded").css({"top":ntop+"px", "z-index":10,"left":nleft+"px","width":new_width+"px", "height":new_height+"px"});

    },
    contract:function(position, item, dimensions){
      var eleinfo =jQuery(item).data('eleinfo'),
          cssinfo = {"width":eleinfo.width+"px", "height":eleinfo.height+"px", "position":eleinfo.position, "left":eleinfo.left+"px", "top":eleinfo.top+"px", "z-index":eleinfo.zindex};
      jQuery(item).removeClass("eg_expanded").css(cssinfo);
    },
    hovers:function(position, items, dimensions){
      D[position].timeout = false;
      jQuery(items).hover(
        function(){
          clearTimeout(D[position].timeout);
          var obj = this, func = function(){ $.expandinggrid.expand(position, obj,dimensions,2.04);};
          D[position].timeout = setTimeout(func, 200);
        }, 
        function(){
          clearTimeout(D[position].timeout);
          $.expandinggrid.contract(position, this,dimensions);
        }
      );
    },
    setup: function(position){
      D[position].totals = {rows:0, columns:P[position].columns};
      //fetch the items
      D[position].items = $.expandinggrid.fetchitems(position);
      //figure out the dimensions
      D[position].closed_dimensions = $.expandinggrid.closed_dimensions(position);
      //apply the dimensions to each item
      $.expandinggrid.apply_dimensions(position, D[position].items, D[position].closed_dimensions);
      $.expandinggrid.hovers(position, D[position].items, D[position].closed_dimensions);
    }
  };
  
  var D=$.expandinggrid.data,
      P=$.expandinggrid.params,
      usecount=0
      ;
    
})(jQuery);