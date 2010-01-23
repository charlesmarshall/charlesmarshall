(function(jQuery) {
  
  jQuery.fn.translator = function(options){
    P[usecount] = jQuery.extend({}, jQuery.fn.translator.defaults, options, {container:this});
    D[usecount] = {};
    return this.each(function(){
      if(this.__translator) return;
      else this.__translator = usecount;
      jQuery.translator.setup(usecount);
      usecount++;
    });
  };
  
  jQuery.fn.translator.defaults = {
                                 "origin": '#translate',
                                 "origin_language": '#original_language',
                                 "result": '#result',
                                 "result_language": '#result_language'
                               };
  
  
  jQuery.translator = {
    data:[],
    params:[],
    
    setup:function(usecount){
      jQuery(P[usecount].origin).each(function(){
                
        jQuery(this).keyup(function(e){
          if((e.keyCode == 13 || e.keyCode == 32) && jQuery(this).value().length) jQuery.translator.translate(usecount, this);
        });
        
        jQuery(this).parents('form').submit(function(e){
          jQuery.translator.translate(usecount, this);
          return false;
        });
        
      });     
    },
    translate:function(usecount, ele){
      var trans = "", original_lang = "";
      
      if(jQuery(ele).value()) trans = jQuery(ele).value();
      else if(jQuery(ele).text()) trans = jQuery(ele).text();
      
      if(P[usecount].origin_language.length && jQuery(P[usecount].origin_language).length){
        if(jQuery(P[usecount].origin_language).value()) original_lang = jQuery(P[usecount].origin_language).value();
        else if(jQuery(P[usecount].origin_language).text()) original_lang = jQuery(P[usecount].origin_language).text();
      }else original_lang = P[usecount].origin_language;
      
      
    }
  };
  
  var D=jQuery.translator.data,
      P=jQuery.translator.params,
      usecount=0
      ;
    
})(jQuery);