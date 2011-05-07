var dDATA =
[
  {"Player":"Player 1", "Score":"140", "Date":"2011-05-01"},
  {"Player":"Player 1", "Score":"100", "Date":"2011-04-16"},
  {"Player":"Player 1", "Score":"105", "Date":"2011-04-30"},
  {"Player":"Player 2", "Score":"110", "Date":"2011-05-01"},
  {"Player":"Player 2", "Score":"120", "Date":"2011-04-16"},
  {"Player":"Player 2", "Score":"125", "Date":"2011-04-30"},
  {"Player":"Player 3", "Score":"100", "Date":"2011-05-01"},
  {"Player":"Player 3", "Score":"90", "Date":"2011-04-16"},
  {"Player":"Player 3", "Score":"100", "Date":"2011-04-30"}
];

jQuery(document).ready(function(){

  jQuery("#raw-data-example").html(JSON.stringify(dDATA).replace(/(},)/gi, "},\n") );


  window.AppView = Backbone.View.extend({
    el: jQuery("body"),
    graphs:[],
    graph_counter: 0,
    initialize: function(){
      var data = dDATA, names = this.findAllColumnNames(data), g, defaults = {'pie':{value:"Score", group:"Player"}, 'bar':{x:"Score", y:"Date"}};

      for(var i in defaults){
        g = this.draw.containers[i]("#content", "Bar Chart", defaults[i], this.graph_counter);
        this.graphs.push(g);
        this.draw.graphs[i](data, defaults[i], this.graph_counter);
        this.graph_counter++;
      }
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
    findAllColumnNames: function(data){
      var names = {};
      for(row in data) for(col in data[row]) names[col] = col;
      return names;
    },
    draw:{
      containers:{
        pie:function(appendTo, title, cols, graph_number){
          var colstr ="", container = "";
          for(var z in cols) colstr+= cols[z]+"/";
          if(colstr.length) colstr = colstr.substring(0,colstr.length-1);
          container = "<div class='container clearfix graph-"+graph_number+"' id='graph-"+graph_number+"'><h2>"+title+" ("+colstr+")</h2><div class='inner' id='g-"+graph_number+"'></div></div>";
          jQuery(appendTo).append(container);
          return jQuery(container);
        },
        bar:function(appendTo, title, cols, graph_number){
          var colstr ="", container = "";
          for(var z in cols) colstr+= cols[z]+"/";
          if(colstr.length) colstr = colstr.substring(0,colstr.length-1);
          container = "<div class='container clearfix graph-"+graph_number+"' id='graph-"+graph_number+"'><h2>"+title+" ("+colstr+")</h2><div class='inner' id='g-"+graph_number+"'></div></div>";
          jQuery(appendTo).append(container);
          return jQuery(container);
        }
      },
      graphs:{
        pie:function(data, cols, graph_number){
          var ca = jQuery("#graph-"+graph_number),
              groupcol = cols.group,
              valuecol = cols.value,
              chart = false,
              total = 0,
              pie,
              w=(ca.outerWidth()-10),
              h=300,
              _data=[],
              _labels=[],
              _values={},
              r = Raphael("g-"+graph_number, w, h);

          //convert th data
          for(var z in data){
            var ind = data[z][groupcol], v = parseInt(data[z][valuecol]);;
            total += v;
            if(typeof _values[ind] == "undefined") _values[ind] = 0;
            _values[ind] += v;
          }

          //now use total to make percentage values
          for(var z in _values){
            _labels.push("%%.%% - "+z);
            _data.push((_values[z]/total)*100);
          }

          r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";
          pie = r.g.piechart(w/3, h/2, 130, _data, {legend: _labels, legendpos: "east"});
          pie.hover(function () {
                      this.sector.stop();
                      this.sector.scale(1.1, 1.1, this.cx, this.cy);
                      if (this.label) {
                        this.label[0].stop();
                        this.label[0].scale(1.5);
                        this.label[1].attr({"font-weight": 800});
                      }
                    }, function () {
                      this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
                      if (this.label) {
                        this.label[0].animate({scale: 1}, 500, "bounce");
                        this.label[1].attr({"font-weight": 400});
                      }
                    });

        },
        bar:function(data, cols, graph_number){
          var ca = jQuery("#graph-"+graph_number),
              xcol = cols.x,
              ycol = cols.y,
              chart = false,
              w=(ca.outerWidth()-20),
              h=300,
              _data=[],
              _labels=[],
              r = Raphael("g-"+graph_number, w, h);

          ca.addClass('graph-loaded');

          for(var i in data){
            _data.unshift(data[i][xcol]);
            _labels.unshift(data[i][ycol]);
          }
          chart = r.g.barchart(0, 10, (w-20), (h-20), [_data], {stacked: true});
          chart.hover(function() {
            // Create a popup element on top of the bar
            this.flag = r.g.popup(this.bar.x, this.bar.y, (this.bar.value || "0")).insertBefore(this);
          }, function() {
              // hide the popup element with an animation and remove the popup element at the end
              this.flag.animate({opacity: 0}, 300, function () {this.remove();});
          });
          r.g.txtattr = {font:"12px Fontin-Sans, Arial, sans-serif", fill:"#000", "font-weight": "normal"};
        }
      }
    }
  });

  window.App = new AppView;


});