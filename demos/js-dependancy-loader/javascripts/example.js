var config = [
  //simple loading of script
  {
    url:"http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"
  },
  //loading an image instead of a script and setting
  {
    tagName: "img",
    attrs:{
      src:"http://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_2013_Google.png/251px-Logo_2013_Google.png",
      style:{
        display:"none"
      },
      height:1
    }
  },
  //after load function
  {
    url:"http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.17/jquery-ui.min.js",
    afterLoad: function(){
      console.log("loaded jquery ui");
    }
  }
];

var completed = function(){
  console.log("LOADED ALL");
};

var testing = new loader( config, completed);