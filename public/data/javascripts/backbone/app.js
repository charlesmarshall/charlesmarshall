var dDATA =
[
  {"Player":"Player 1", "Score":"140", "Date":"2011-05-01"},
  {"Player":"Player 1", "Score":"100", "Date":"2011-04-16"},
  {"Player":"Player 1", "Score":"105", "Date":"2011-04-30"},
  {"Player":"Player 2", "Score":"110", "Date":"2011-05-01"},
  {"Player":"Player 2", "Score":"120", "Date":"2011-04-16"},
  {"Player":"Player 2", "Score":"125", "Date":"2011-04-30"}
];

jQuery(document).ready(function(){
  
  jQuery("#raw-data-example").html(JSON.stringify(dDATA).replace(/(},)/gi, "},\n") );
  
  
  window.AppView = Backbone.View.extend({
    el: jQuery("#data-entry"),
    events: {
      "submit #data-entry-manual-form": "formSubmit",
      "click .use": "replaceData"
    },
    replaceData: function(e){
      e.preventDefault();
      var find = jQuery(e.target||e.srcElement).attr('href');
      jQuery("#raw-data").val(jQuery(find).text());
    },
    formSubmit: function(e){
      console.log("submit");
      e.preventDefault();
      var data = jQuery(this).find('textarea').val();
    }
  });
  
  window.App = new AppView;
  
  
});