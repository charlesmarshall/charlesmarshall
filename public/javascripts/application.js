/**** Add application wide javascripts below this point  ******/
$(document).ready(function(){
	$(".thumb").modal();	
	
	$("#cmsq_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_filter($("#cmsq_filter").val())', 1000);
  });

	$("#cmsq_filter").focus(function(){
    if($(this).val() =="search me") {$(this).val('');} 
  });
  $("#cmsq_filter").blur(function(){if($(this).val() =="") {$(this).val('search me');} });
	$("#cmsq_filter").val('search me');
	
});


function delayed_filter(filter) {
	if(filter.length>0){
  	$("#cmsq_filter").css("background-image", "url(/images/cms/indicator.gif)");
  	$.get("/inline_search/?cmsq="+filter, 
					function(response){ 
     				$("#results").html(response);
						$("#cmsq_filter").css("background-image", "url(/images/question-mark.png)");
						clearTimeout(t);
    			});
	}
}