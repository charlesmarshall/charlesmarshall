jQuery(document).ready(function(){

  jQuery(".play").on("click", function(e){
    e.preventDefault();
    jQuery("#segment1").removeClass("animate").addClass("animate");
  });
});