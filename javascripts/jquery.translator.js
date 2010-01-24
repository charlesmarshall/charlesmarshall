jQuery.fn.tagName = function() {
    return this.get(0).tagName;
};

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
        var obj = this;
        jQuery(this).keyup(function(e){
          console.log(this);
          if((e.keyCode == 13 || e.keyCode == 32) && jQuery(this).val().length) jQuery.translator.translate(usecount, obj);
        });
        
        jQuery(this).parents('form').submit(function(e){
          jQuery.translator.translate(usecount, this);
          return false;
        });
        
      });     
    },
    translate:function(usecount, ele){
      var trans = "", original_lang = "", result_language = "";
      
      if(jQuery(ele).val()) trans = jQuery(ele).val();
      else if(jQuery(ele).text()) trans = jQuery(ele).text();
      
      if(jQuery(P[usecount].origin_language).length){
        if(jQuery(P[usecount].origin_language).val()) original_lang = jQuery(P[usecount].origin_language).val();
        else original_lang = jQuery(P[usecount].origin_language).text();
      }else original_lang = P[usecount].origin_language;
      
      if(jQuery(P[usecount].result_language).length){
        if(jQuery(P[usecount].result_language).val()) result_language = jQuery(P[usecount].result_language).val();
        else result_language = jQuery(P[usecount].result_language).text();
      }else result_lang = P[usecount].result_language;
      
      google.language.translate(trans, original_lang, result_language, function(result) {
        if (!result.error) {
          var tagname = jQuery(P[usecount].result).tagName();
          if( tagname == "input" || tagname == "select" || tagname == "textarea") jQuery(P[usecount].result).val(result.translation);
          else jQuery(P[usecount].result).text(result.translation);
        }
      });
    }
  };
  
  var D=jQuery.translator.data,
      P=jQuery.translator.params,
      usecount=0
      ;
    
})(jQuery);