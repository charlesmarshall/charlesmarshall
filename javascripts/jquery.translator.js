jQuery.fn.tag = function() {
  return String(this.get(0).tagName).toLowerCase();
};

(function(jQuery) {
  
  jQuery.fn.translator = function(options){
    P[usecount] = jQuery.extend({}, jQuery.fn.translator.defaults, options, {container:this});
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
                                 "result_language": '#result_language',
                                 "after_translate":false;
                               };
  
  
  jQuery.translator = {
    params:[],
    
    setup:function(usecount){
      if(P[usecount].container.tag() == 'form') jQuery.translator.setup_form(usecount);
      jQuery.translator.translate(usecount,jQuery(P[usecount].origin));      
    },
    setup_form:function(usecount){
      jQuery(P[usecount].origin).each(function(){
        var obj = this;
        jQuery(this).keyup(function(e){
          if((e.keyCode == 13 || e.keyCode == 32) && jQuery(this).val().length) jQuery.translator.translate(usecount, obj);
        });
      });  
      jQuery(P[usecount].container).submit(function(){
        jQuery.translator.translate(usecount, jQuery(P[usecount].origin));
        return false;
      });
      jQuery(P[usecount].origin_language).change(function(){
        jQuery.translator.translate(usecount, jQuery(P[usecount].origin));
        return false;
      });
      jQuery(P[usecount].result_language).change(function(){
        jQuery.translator.translate(usecount, jQuery(P[usecount].origin));
        return false;
      });
    },
    translate:function(usecount, ele){
      var trans = (jQuery(ele).length) ? jQuery(ele) : false,          
          origin_lang = (jQuery(P[usecount].origin_language).length && P[usecount].origin_language.length > 1) ? jQuery(P[usecount].origin_language) : '',          
          dest_lang = (jQuery(P[usecount].result_language).length && P[usecount].result_language.length > 1) ? jQuery(P[usecount].result_language) : '',          
          dest = (P[usecount].result.length > 1 && jQuery(P[usecount].result).length) ? jQuery(P[usecount].result) : false,
          tagname = '',
          translate = '',
          original_language = '',
          dest_language = ''
          ;

      if(trans){
        tagname = trans.tag();
        if(tagname == 'input' || tagname == 'select' || tagname == 'textarea') translate = trans.val();
        else translate = trans.text();
      }
      
      if(origin_lang){
        tagname = origin_lang.tag();
        if(tagname == 'input' || tagname == 'select' || tagname == 'textarea') original_language = origin_lang.val();
        else original_language = origin_lang.text();        
      }else original_language = P[usecount].origin_language;
      
      if(dest_lang){
        tagname = dest_lang.tag();
        if(tagname == 'input' || tagname == 'select' || tagname == 'textarea') dest_language = dest_lang.val();
        else dest_language = dest_lang.text();        
      }else dest_language = P[usecount].result_language;
        
      google.language.translate(translate, original_language, dest_language, function(result) {
        if(!result.error) {
          var tagname = jQuery(P[usecount].result).tag();
          if( tagname == "input" || tagname == "select" || tagname == "textarea") jQuery(P[usecount].result).val(result.translation);
          else jQuery(P[usecount].result).text(result.translation);
          if(typeof(P[usecount].after_translate) == 'function') P[usecount].after_translate(result);
        }
      });
    }
  };
  
  var D=jQuery.translator.data,
      P=jQuery.translator.params,
      usecount=0
      ;
    
})(jQuery);