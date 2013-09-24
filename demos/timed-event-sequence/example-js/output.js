jQuery(document).ready(function(){

  jQuery(".example_block").on("click", "span", function(e){
    var span = jQuery(this),
          parent = span.parents(".example_block"),
          example = parent.attr("id").replace("-elements", ""),
          inner = jQuery("#output-events .output."+example);
          pos = parent.find("span").index(span),
          html = inner.html(),
          extra = "<p><strong>"+example+"</strong> pos:"+pos+"</p>"
          ;
    inner.html(html+extra);
  });
});