(function($){
  function timedEventSequence(items, options){
    var main = this;
    this.items = items;
    this.options = options;
    this.timer = setInterval(function(){
      main.run();
    }, this.options.interval);
  }
  timedEventSequence.prototype.run = function(){
    var current = this.options.position,
          length = this.items.length,
          currentItem = this.items.eq(current),
          newPosition = (current+1 >= length) ? 0 : current+1,
          newItem = this.items.eq(newPosition)
          ;
    if(this.options.beforeEvent(this.items, currentItem, newItem, this.options.eventType) ){
      newItem.trigger(this.options.eventType);
      this.options.position = newPosition;
      this.options.afterEvent(this.items, currentItem, newItem, this.options.eventType);
    }
  };

  $.fn.timedEventSequence = function(options){
    var opts = $.extend({}, $.fn.timedEventSequence.defaults, options);

    if(! $(this).data("plugin__tse") ) $(this).data("plugin__tse", new timedEventSequence(this, opts) );
    return this;
  };

  $.fn.timedEventSequence.defaults = {
    interval: 3000,
    eventType: "click",
    position:0, /* assumes that the first item in sequence is already active state */
    beforeEvent: function(allItems, oldItem, newItem, eventType){return true;},
    afterEvent: function(allItems, oldItem, newItem, eventType){return true;}
  };


})(jQuery);