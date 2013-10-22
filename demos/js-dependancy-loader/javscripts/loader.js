function loadScripts(stack, callback){

}
loadScripts.prototype.runner = function(){
  var current = this.stack.shift(),
        attrs = (current.attrs) ? current.attrs: {type:"text/javascript", src:current.url},
        tag = (current.tagName) ? current.tagName : "script"
        ;

};
loadScripts.prototype.stack = [];



/**



**/