jQuery(document).ready(function(){

  jQuery(window).bind("datacentre.security.initialstate", function(e, trigger_animation){
    jQuery("#data_centre_security .wall").css("top", 0);
    jQuery("#data_centre_security .dome").css("top", "-900px");
    jQuery("#data_centre_security .camera, #data_centre_security .light, #data_centre_security .dome").hide();
    if(trigger_animation) setTimeout(function(){ jQuery(window).trigger("datacentre.security.animate"); }, 800);

  });
  jQuery(window).bind("datacentre.security.animate", function(){
    var i=0,
          walls = jQuery("#data_centre_security .wall"),
          l = walls.length
          ;
    walls.each(function(){
      jQuery(this).delay((800*i)).animate({top:"-60"}, 1500, function(){
        var x = walls.index(jQuery(this));
        if(x+1 == l){
          jQuery("#data_centre_security .camera").delay(500).fadeIn(500);
          jQuery("#data_centre_security .light").delay(1200).fadeIn(400, function(){
            jQuery("#data_centre_security .stage").animate({width:"85%", top:"10%"});
            jQuery("#data_centre_security .dome").show().delay(100).animate({top:0}, 1200);
          });
        }
      });
      i++;
    });

  });

  jQuery(".play").on("click", function(e){
    e.preventDefault();
    jQuery(window).trigger("datacentre.security.initialstate", [true]);
  });


});
