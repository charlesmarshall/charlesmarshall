jQuery(document).ready(function(){
  
  //a collection of dRow
  window.dCollection = Backbone.Model.extend({
    model: dRow,
    localStorage: new Store("dRows"),
    // keep in sequential order, despite being saved by unordered GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      else return this.last().get('order') + 1;
    },
    //are sorted by their original insertion order.
    comparator: function(row) {
      return row.get('order');
    }
  });
  
});