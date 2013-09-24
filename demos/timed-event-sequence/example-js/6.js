jQuery(document).ready(function(){
  var items = jQuery("#example-6-elements span");

  items.timedEventSequence({
    interval:3000,
    beforeEvent:function(items, currentitem, newitem){
      items.filter(".active").removeClass("active");
      return true;
    },
    afterEvent:function(items, before_click_item, after_click_item){
      after_click_item.addClass("active");
      return true;
    }
  });

  //stop
  jQuery("#example-6-copy").on("click", "a", function(e){
    var clicked = jQuery(this);
    e.preventDefault();
    if(clicked.hasClass("stop")) items.timedEventSequence("stop");
    else if(clicked.hasClass("start")) items.timedEventSequence("start");
    else if(clicked.hasClass("restart")) items.timedEventSequence("restart");
    else if(clicked.hasClass("reset")) items.timedEventSequence("reset");
    else if(clicked.hasClass("slow")) items.timedEventSequence("option", "interval", 6000);
    else if(clicked.hasClass("fast")) items.timedEventSequence("option", "interval", 1000);
    else if(clicked.hasClass("normal")) items.timedEventSequence("option", "interval", 3000);
  });

});