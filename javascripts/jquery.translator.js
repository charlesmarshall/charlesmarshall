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
                                 "result_language": '#result_language'
                               };
  
  
  jQuery.translator = {
    params:[],
    
    setup:function(usecount){
      jQuery(P[usecount].origin).each(function(){
        var obj = this;
        jQuery(this).keyup(function(e){
          if((e.keyCode == 13 || e.keyCode == 32) && jQuery(this).val().length) jQuery.translator.translate(usecount, obj);
        });
        
        jQuery(this).parents('form').submit(function(e){
          jQuery.translator.translate(usecount, this);
          return false;
        });
        
      });     
    },
    translate:function(usecount, ele){
      var trans = (jQuery(ele).length) ? jQuery(ele).length : false,          
          origin_lang = (P[usecount].origin_language.length > 1) ? jQuery(P[usecount].origin_language) : '',          
          dest_lang = (P[usecount].result_language.length > 1) ? jQuery(P[usecount].result_language) : '',          
          dest = (P[usecount].result.length > 1 && jQuery(P[usecount].result).length) ? jQuery(P[usecount].result) : false,
          tagname = '',
          translate = '',
          original_language = ''
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
      }
      console.log(original_language);
      //    
      //    if(dest_lang.length){        
      //      if(dest_lang_tag == 'input' || dest_lang_tag == 'select' || dest_lang_tag == 'textarea') dest_language = dest_lang.val();
      //      else dest_language = dest_lang.text();        
      //    }else dest_language = P[usecount].result_language;
      //    
      // 
      
      
      // google.language.translate(trans, original_lang, result_lang, function(result) {
      //         console.log("here...");
      //         if (!result.error) {
      //           var tagname = jQuery(P[usecount].result).tagName();
      //           if( tagname == "input" || tagname == "select" || tagname == "textarea") jQuery(P[usecount].result).val(result.translation);
      //           else jQuery(P[usecount].result).text(result.translation);
      //         }
      //       });
    }
  };
  
  var D=jQuery.translator.data,
      P=jQuery.translator.params,
      usecount=0
      ;
    
})(jQuery);