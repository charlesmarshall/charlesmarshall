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
    el: jQuery("body"),
    events: {
      "submit #data-entry-manual-form": "triggerGraphForm",
      "click #default-example": "useDefaultData"
    },
    useDefaultData: function(){
      e.preventDefault();
      var find = jQuery(e.target||e.srcElement).attr('href'), data = jQuery(find).text();
      jQuery("#raw-data").val(data);
      if(data) parsed = this.parseData(data);
      if(parsed) this.graphForm(parsed);
    },
    triggerGraphForm: function(e){
      e.preventDefault();
      var data = jQuery(e.target||e.srcElement).find('textarea').val(), 
          parsed = false
          ;
      if(data) parsed = this.parseData(data);
      if(parsed) this.graphForm(parsed);
    },
    parseData: function(data){
      try{
        parsed = JSON.parse(data); 
      }catch(error){
        alert('Invalid json');
        return false;
      }
      return parsed;
    },
    graphForm: function(data){
      
    }
  });
  
  window.App = new AppView;
  
  
});