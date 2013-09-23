jQuery(document).ready(function(){
  jQuery("#example-5-elements span").timedEventSequence({
    position:3,
    interval:4000,
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