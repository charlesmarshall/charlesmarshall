jQuery(document).ready(function(){
  
  //a row of data
  // - has content - uses localstorage
  window.dRow = Backbone.Model.extend({
    EMPTY: {},    
    initialize: function(){
      if(!this.get("content")) this.set({"content": this.EMPTY});
    },
    clear: function(){
      this.destroy();
      this.view.remove();
    }    
  });
  
});