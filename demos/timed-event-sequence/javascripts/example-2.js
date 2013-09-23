jQuery(document).ready(function(){
  jQuery("#example-2-elements span").timedEventSequence({
    /**
      * items - this is all elements that match the jQuery selector used above
      * current_item - the item that is currently in use
      * new_item - the item that will be clicked
      * NOTE: this function is used in the if block so has to return a positive for the plugin to continue
      */
    beforeEvent:function(items, current_item, new_item){
      current_item.removeClass("active");
      new_item.addClass("active");
      return true;
    }
  });
});