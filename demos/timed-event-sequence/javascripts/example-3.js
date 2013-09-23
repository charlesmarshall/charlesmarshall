jQuery(document).ready(function(){
  jQuery("#example-3-elements span").timedEventSequence({
    /**
      * change the time the event happens at
      */
    interval:2000,
    /**
      * items - this is all elements that match the jQuery selector used above
      * before_click_item - the item that was in use before the click
      * after_click_item - the item that has just been clicked
      */
    afterEvent:function(items, before_click_item, after_click_item){
      before_click_item.removeClass("active");
      after_click_item.addClass("active");
      return true;
    }
  });
});