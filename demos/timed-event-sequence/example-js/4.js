jQuery(document).ready(function(){
  jQuery("#example-4-elements span").timedEventSequence({
    interval:1200,
    beforeEvent:function(items, currentitem, newitem){
      currentitem.removeClass("active");
      return true;
    },
    afterEvent:function(items, before_click_item, after_click_item){
      after_click_item.addClass("active");
      return true;
    }
  });
});