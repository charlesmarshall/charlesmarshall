function loader(stack, callback, async){
  this.stack = stack;
  if(async) this.async = async;
  if(typeof callback != "undefined") this.onComplete = callback;
  //if set to async, just load them all in one go
  if(this.async) for(var x in this.stack) this.load(this.stack[x]);
  else this.load();
}
loader.prototype.stack = [];
loader.prototype.onComplete = false;
loader.prototype.async = false;

loader.prototype.onLoad = function(ele, obj){
  ele.onload = ele.onreadystatechange = function(){
    //if the item we just loaded has an afterLoad function, call it & pass along the element
    if(typeof ele.__afterLoad != "undefined") ele.__afterLoad(this);
    //if there are items left to load, recall the load
    if(obj.stack.length && !obj.async) obj.load();
    //otherwise, if there is a completed function, run that
    else if(obj.onComplete && typeof obj.onComplete != "undefined") obj.onComplete();
  };
};
loader.prototype.attrs = function(ele, attrs){
  for(var x in attrs){
    if(typeof attrs[x] == "object") for(var i in attrs[x]) ele[x][i] = attrs[x][i];
    else ele[x] = attrs[x];
  }
};

loader.prototype.load = function(item){

  var current = (typeof item != "undefined") ? item : this.stack.shift(), attrs, tag, insertAt, ele;
  if(current){

    //setup the config values
    insertAt = (current.insertAt) ? current.insertAt : document.getElementsByTagName("body")[0];
    attrs = (current.attrs) ? current.attrs: {type:"text/javascript", src:current.url, async:true};
    tag = (current.tagName) ? current.tagName : "script";
    ele = document.createElement(tag);
    //set as a property so it can run even without async
    ele.__afterLoad = current.afterLoad;
    //copy over the attrs
    this.attrs(ele, attrs);
    //call the function to handle load events
    this.onLoad(ele, this);
    //insert to DOM
    insertAt.appendChild(ele);
  }

};


