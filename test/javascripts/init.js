var XR
    ;

function ___XSTART(){
  XR.bindEvents();
}

function __XeventTriggered(e, x){

  var ele = (typeof this != "function") ? this : ( (typeof e.srcElement != "undefined") ? e.srcElement : e.targetElement ),
        val = (typeof ele.value) ? ele.value : ele.href,
        name = (ele.name) ? ele.name : ele.id
       ;
  XR.events.push({"type":e.type,"name":name, "val":val, "page":XR.location()});
}
/**
  * CONFIG
  */
function __conf__(token){
  this.token = token;
  for(var x in this.assets) this.assets[x] = this.assets[x].replace("%p", this.protocol).replace("%h", this.hostname).replace("%t", this.token).replace("%v", this.version);
}
__conf__.prototype.page_timer = 4000;
__conf__.prototype.push_timer = 700;
__conf__.prototype.token = "T";
__conf__.prototype.protocol = "//";
__conf__.prototype.hostname = "charlesmarshall.co.uk";
__conf__.prototype.version = "test";
__conf__.prototype.selectors = [
  {"selector":"input", "event":"blur"},
  {"selector":"textarea", "event":"blur"},
  {"selector":"select", "event":"change"},
  {"selector":"a", "event":"click"}
];
__conf__.prototype.assets = {
  "data":"%p%h/%v-%t/?",
  "engine":"%p%h/%v/javascripts/sizzle.js"
};
/**
  * EVENT HANDLING
  */
function __eventhandler__(){}
__eventhandler__.prototype.add = function(obj, type, fn){
  if(obj.attachEvent){
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );};
    obj.attachEvent( 'on'+type, obj[type+fn] );
  }else obj.addEventListener( type, fn, false );
};
__eventhandler__.prototype.remove = function(obj, type, fn){
  if(obj.detachEvent){
    obj.detachEvent( 'on'+type, obj[type+fn] );
    obj[type+fn] = null;
  }else obj.removeEventListener( type, fn, false );
};
/**
  * SELECTOR ENGINE
  */
function __selector__(c){
  this.conf = c;
}
__selector__.prototype.conf = false;
__selector__.prototype.type = "";
__selector__.prototype.engine = false;
__selector__.prototype.check = function(){
  //if sizzle or jquery (1.3+) then sizzle exists, so use it
  if((typeof window.Sizzle != "undefined") || (typeof window.$ != "undefined" && typeof jQuery != "undefined" && parseFloat($.fn.jquery) >= 1.3) ){
    this.type = "sizzle";
    if (typeof window.Sizzle != "undefined") this.engine = Sizzle;
    else if(typeof jQuery != "undefined") this.engine = jQuery.find;
  }
  return this;
};
__selector__.prototype.load = function(){
  var obj = this, sz, s;
  //if engine isnt set, load in Sizzle stand alone
  if(!this.engine){
    sz = document.createElement('script');
    sz.type = 'text/javascript';
    sz.src = this.conf.assets.engine;
    //on load checks
    sz.onload = sz.onreadystatechange = function(){
      obj.check().load();
    };
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(sz, s);
  }else ___XSTART();
};

/**
  * TRANSPORT MECHANISM
  */
function __transporter__(c){
  var s;
  this.conf = c;
  this.ele = document.createElement('img');
  this.ele.id = "XT-"+(Math.random()*10).toString().replace(".", "_");
  this.ele.width = 1;
  this.ele.height = 1;
  this.ele.style.display = "none";
  s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(this.ele, s);
}
__transporter__.prototype.conf = false;
__transporter__.prototype.ele = false;
__transporter__.prototype.toURL = function(data){
  var str = "";
  for(var x in data) if(typeof data[x] != "function") str += "&"+x+"="+encodeURIComponent(data[x]);
  return str;
};
__transporter__.prototype.send = function(packet){
  var url = this.conf.assets.data+this.toURL(packet);
  this.ele.src = url;
};

/**
  * MAIN
  */
function __RUN__(conf, eventhandler, selector, transporter){
  this.conf = conf;
  this.eventhandler = eventhandler;
  this.selector = selector;
  this.transporter = transporter;
  this.events.push({"type":"pageview", "page":this.location()});
}
__RUN__.prototype.conf = false;
__RUN__.prototype.eventhandler = false;
__RUN__.prototype.selector = false;
__RUN__.prototype.transporter = false;
__RUN__.prototype.events = [];
__RUN__.prototype.location = function(){
  return window.location.toString();
};
__RUN__.prototype.init = function(){
  this.selector.check().load();
  return this;
};
__RUN__.prototype.send = function(data){
  if(typeof data !="undefined") this.transporter.send(data);
  return this;
};

__RUN__.prototype.bindEvents = function(){
  var engine = this.selector.engine;
  for(var i in this.conf.selectors){
    var selector = this.conf.selectors[i].selector,
          eve = this.conf.selectors[i].event,
          items = engine(selector);
    for(var e in items) this.eventhandler.add(items[e], eve, __XeventTriggered);
  }
return this;
};
__RUN__.prototype.monitor = function(){
  var obj = this;
  setInterval(function(){
    if(obj.selector.engine && obj.events.length) obj.send(obj.events.pop());
  }, obj.conf.push_timer);
  setInterval(function(){
    obj.events.push({"type":"page", "page":obj.location()});
  }, obj.conf.page_timer);
  return this;
};

//
var XC =new __conf__("T"),
      XE = new __eventhandler__(),
      XS = new __selector__(XC),
      XT = new __transporter__(XC)
      ;
XR = new __RUN__(XC, XE, XS, XT);

/**
  * LOADER / INIT
  */
(function(){
  XR.init().monitor();
})();