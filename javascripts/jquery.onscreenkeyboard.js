(function(jQuery) {
  var keyboardmap={},
      shifted=false
      ;
  keyboardmap['numeric'] = [49,50,51,52,53,54,55,56,57,48];
  keyboardmap['mac'] =[
                        [49,  33],    //1 & !
                        [50,  63],    //2 & @
                        [51,  163],   //3 & £
                        [52,  36],    //4 & $
                        [53,  37],    //5 & %
                        [54,  94],    //6 & ^
                        [55,  38],    //7 & &
                        [56,  42],    //8 & *
                        [57,  40],    //9 & (
                        [48,  41],    //0 & )
                        [45,  95],    //- & _
                        [61,  43],    //= & +
                        8,            //delete
                        9            //tab
                        
                      ];

  jQuery.fn.on_screen_keys = function(options){
    P[usecount] = jQuery.extend({}, jQuery.fn.on_screen_keys.defaults, options, {container:this, keyboardmap:keyboardmap});
    return this.each(function(){
      if(this.__kb) return;
      else this.__kb = usecount;
      jQuery.on_screen_keys.setup(usecount);
      usecount++;
    });
  };

  jQuery.fn.on_screen_keys.defaults = {
                           "capslock":false,
                           "classes":{
                             "keyboard": "keyboard",
                             "key": "key",
                             "active":"active",
                             "inputfield":"text_field"
                           },
                           "type":"mac",
                           "tags":{
                             "keyboard":"div",
                             "key":"a"
                              }
                           };


  jQuery.on_screen_keys = {
    params:[],

    setup:function(usecount){
      var kmap = P[usecount].keyboardmap['mac'];
      if(P[usecount].type && typeof(keyboardmap[P[usecount].type]) != "undefined") kmap = P[usecount].keyboardmap[P[usecount].type];
      if(!jQuery("."+P[usecount].classes.keyboard).length) jQuery.on_screen_keys.insert_keyboard(usecount,kmap);
      jQuery.on_screen_keys.triggers(usecount);
    },
    charval:function(chrval, codeonly){
      var val = "";
      if(codeonly == true) return String.fromCharCode(chrval);
      if(chrval == 16) val = "shift";
      else if(chrval == 13) val = "enter";
      else if(chrval == 9) val = "tab";
      else if(chrval == 32) val = "space";
      else if(chrval == 8) val = "delete";
      else if(chrval == 20) val = "caps lock";
      else val = String.fromCharCode(chrval);
      return val;
    },
    insert_keyboard:function(usecount, map){
      var keystring="", chrval = 0, val="";
      jQuery(P[usecount].container).append("<"+P[usecount].tags.keyboard+" class='"+P[usecount].classes.keyboard+"'></"+P[usecount].tags.keyboard+">");
      for (i in map){
        if(typeof(map[i]) == "object") chrval = map[i][0];
        else chrval = map[i];
        val = jQuery.on_screen_keys.charval(chrval);
        jQuery.data(P[usecount].container, chrval, map[i]);
        keystring += "<"+P[usecount].tags.key+" class='"+P[usecount].classes.key+" char"+chrval+" val"+val+"' rel='"+chrval+"'>"+val+"</"+P[usecount].tags.key+">";
      }
      jQuery(P[usecount].container).find("."+P[usecount].classes.keyboard).append(keystring);
    },
    triggers:function(usecount){
      jQuery(P[usecount].container).unbind("keydown keyup").bind("keydown keyup", function(e){
        var code = e.keyCode,
            keyitem = jQuery(P[usecount].container).find(P[usecount].tags.key+".char"+code)
            ;
        if(code == 16){          
          if(shifted) shifted = false;
          else shifted = true;
          jQuery.on_screen_keys.keyshift(usecount,shifted);
        }
        if(e.type == "keydown") keyitem.addClass(P[usecount].classes.active);
        else keyitem.removeClass(P[usecount].classes.active);
        
      });
      if(P[usecount].classes.inputfield){
        jQuery(P[usecount].container).find(P[usecount].tags.key+"."+P[usecount].classes.key).unbind("click").bind("click",function(){
          var kb= this;
          jQuery(P[usecount].container).find("."+P[usecount].classes.inputfield).each(function(){
            var jqd = jQuery.data(P[usecount].container,jQuery(kb).attr('rel')), val = 0;
            if(typeof(jqd) == "object" && shifted) val = jqd[1];
            else if(typeof(jqd) == "object" && shifted) val = jqd[0];
            else val = jqd;
            if(val == 8) jQuery(P[usecount].container).find("."+P[usecount].classes.inputfield).each(function(){jQuery(this).val(jQuery(this).val().substr(0, jQuery(this).val().length-1));});
            else jQuery(this).val(jQuery(this).val()+jQuery.on_screen_keys.charval(val,true));
          });
        });
      }
    },
    keyshift:function(usecount,c){
      var kmap = keyboardmap[P[usecount].type], charval=0, look=0, index=(c)?1:0;
      for (i in kmap){
        if(typeof(kmap[i]) == "object" && kmap[i][index]){
          look = kmap[i][0];
          chrval = kmap[i][index];
        }else chrval = look = kmap[i];
        jQuery(P[usecount].container).find(P[usecount].tags.key+".char"+look).html(jQuery.on_screen_keys.charval(chrval));
      }
    }
  };

  var P=jQuery.on_screen_keys.params,
      usecount=0
      ;

})(jQuery);