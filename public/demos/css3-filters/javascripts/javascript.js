jQuery(document).ready(function(){
  jQuery(".example_block a").on("click", function(e){
    e.preventDefault();
    jQuery(this).parents(".example_block").find("img").attr("class", "").addClass(jQuery(this).attr("data-class") );
  });
});