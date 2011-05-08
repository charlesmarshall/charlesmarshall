function removeDuplicate(_array){
  var newArray=new Array();
  label:for(var i=0; i<_array.length;i++ ){
    for(var j=0; j<newArray.length;j++ ){
      if(newArray[j]==_array[i])
      continue label;
    }
    newArray[newArray.length] = _array[i];
  }
  return newArray;
}


var DEFAULT_DATASETS = {
  'Website Stats':{
    graphs:[
      {_type:'line', group_line:"browser", x:"hour", y:"views"},
      {_type:'pie', value:"views", group:"page"},
      {_type:'pie', value:"views", group:"country"},
      {_type:'pie', value:"views", group:"browser"}
    ],
    'data':[
      {views:1, page:"/", country:"UK", hour:0900, browser:"IE", version:"7"},
      {views:1, page:"/help", country:"UK", hour:0900, browser:"IE", version:"7"},
      {views:1, page:"/faq", country:"UK", hour:0900, browser:"IE", version:"7"},
      {views:1, page:"/faq", country:"UK", hour:1100, browser:"IE", version:"7"},
      {views:1, page:"/", country:"UK", hour:1900, browser:"IE", version:"8"},
      {views:1, page:"/about", country:"UK", hour:1100, browser:"IE", version:"8"},
      {views:1, page:"/", country:"Ireland", hour:1200, browser:"IE", version:"8"},
      {views:1, page:"/contact", country:"UK", hour:1100, browser:"IE", version:"7"},
      {views:1, page:"/", country:"UK", hour:0900, browser:"IE", version:"7"},
      {views:1, page:"/login", country:"Germany", hour:1500, browser:"IE", version:"9"},

      {views:1, page:"/", country:"UK", hour:0900, browser:"FireFox", version:"4"},
      {views:1, page:"/help", country:"UK", hour:1100, browser:"FireFox", version:"4"},

      {views:1, page:"/", country:"France", hour:1400, browser:"Chrome", version:"13"},
      {views:1, page:"/faq", country:"UK", hour:2100, browser:"Chrome", version:"13"},
      {views:1, page:"/", country:"UK", hour:2300, browser:"IE", version:"7"},
      {views:1, page:"/forgot", country:"UK", hour:2000, browser:"IE", version:"8"},
      {views:1, page:"/", country:"UK", hour:1200, browser:"IE", version:"7"},
      {views:1, page:"/contact", country:"UK", hour:1100, browser:"IE", version:"8"},
      {views:1, page:"/", country:"UK", hour:0900, browser:"IE", version:"9"},
      {views:1, page:"/login", country:"UK", hour:1500, browser:"IE", version:"8"}
    ]
  }

};

jQuery(document).ready(function(){


  window.AppView = Backbone.View.extend({
    el: jQuery("body"),
    data_sets:DEFAULT_DATASETS,
    current_data_set:false,
    graphs:[],
    graph_counter: 0,
    events:{
      "change .data-set-list":"datasetChange"
    },
    initialize: function(){
      this.addDatasetsToSelect(this.data_sets, jQuery(".data-set-list"));
      this.redrawAllGraphs(jQuery("#data-set-list"));
    },
    redrawAllGraphs:function(select){
      jQuery(".g-container").remove();
      this.graph_counter = 0;
      this.current_data_set = this.getSelectedDataset(select);
      this.current_data_set.column_names = this.findAllColumnNames(this.current_data_set.data);
      this.addDatasetGraphs(this.current_data_set);
    },
    datasetChange:function(e){
      e.preventDefault();
      this.redrawAllGraphs(jQuery(e.target||e.srcElement));
    },
    addDatasetsToSelect:function(datasets, select){
      var options = '';
      for(var x in datasets) options +='<option value="'+x+'">'+x+'</option>';
      select.each(function(){
        jQuery(this).html(options);
      });
    },
    getSelectedDataset:function(select){
      var selected = select.val();
      return this.data_sets[selected];
    },
    addDatasetGraphs:function(dataset){
      for(var i in dataset.graphs) this.graphs.push(this.addGraph(dataset.graphs[i]._type, dataset.graphs[i], dataset.data));
    },
    addGraph:function(graphtype, cols, data){
      var g;
      if(typeof this.draw.containers[graphtype] != "undefined") g = this.draw.containers[graphtype]("#content", graphtype.charAt(0).toUpperCase()+graphtype.substring(1)+" Chart", cols, this.graph_counter);
      else g = this.draw.containers.generic("#content", graphtype.charAt(0).toUpperCase()+graphtype.substring(1)+" Chart", cols, this.graph_counter);
      this.draw.graphs[graphtype](data, cols, this.graph_counter);
      this.graph_counter++;
      return g;
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
        line:function(appendTo, title, cols, graph_number){
          var colstr ="", container = "";
          for(var z in cols) if(z.charAt(0) != "_") colstr+= cols[z]+"/";
          if(colstr.length) colstr = colstr.substring(0,colstr.length-1);
          container = "<div class='g-container container container-large clearfix graph-"+graph_number+"' id='graph-"+graph_number+"'><h2>"+title+" ("+colstr+")</h2><div class='inner' id='g-"+graph_number+"'></div></div>";
          jQuery(appendTo).append(container);
          return jQuery(container);
        },
        generic:function(appendTo, title, cols, graph_number){
          var colstr ="", container = "";
          for(var z in cols) if(z.charAt(0) != "_") colstr+= cols[z]+"/";
          if(colstr.length) colstr = colstr.substring(0,colstr.length-1);
          container = "<div class='g-container container clearfix graph-"+graph_number+"' id='graph-"+graph_number+"'><h2>"+title+" ("+colstr+")</h2><div class='inner' id='g-"+graph_number+"'></div></div>";
          jQuery(appendTo).append(container);
          return jQuery(container);
        }

      },
      graphs:{
        line:function(data, cols, graph_number){
          jQuery("#g-"+graph_number).html('');
          var ca = jQuery("#graph-"+graph_number),
              line_group = cols.group_line,
              xcol = cols.x,
              ycol = cols.y,
              w=(ca.outerWidth()*0.95),
              h=300,
              lines={},
              x=[],
              y=[],
              r = Raphael("g-"+graph_number, w, h);

          if(line_group){
            for(var r in data){
              var a = data[r][line_group], b = data[r][xcol];
              if(typeof lines[a] == "undefined") lines[a] = {};
              if(typeof lines[a][b] == "undefined") lines[a][b] = 0;
              lines[a][b] += parseInt(data[r][ycol]);
            }
            for(var a in lines){
              var tmp_x=[], tmp_y=[];
              for(var b in lines[a]){
                tmp_x.push(b);
                tmp_y.push(lines[a][b]);
              }
              x.push(tmp_x);
              y.push(tmp_y);
            }
          }
          console.log(lines);
          console.log(x);
          console.log(y);
          
          var lines = r.g.linechart(40, 10, w-50, h-50, x, y, {nostroke: false, axis: "0 0 1 1", symbol: "o"}).hoverColumn(function () {
                        this.tags = r.set();
                        for (var i = 0, ii = this.y.length; i < ii; i++) {
                          this.tags.push(r.g.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{fill: "#fff"}, {fill: this.symbols[i].attr("fill")}]));
                        }
                      }, function () {
                        this.tags && this.tags.remove();
                      });


        },
        pie:function(data, cols, graph_number){
          jQuery("#g-"+graph_number).html('');
          var ca = jQuery("#graph-"+graph_number),
              groupcol = cols.group,
              valuecol = cols.value,
              chart = false,
              total = 0,
              pie,
              w=(ca.outerWidth()*0.9),
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
          jQuery("#g-"+graph_number).html('');
          var ca = jQuery("#graph-"+graph_number),
              xcol = cols.x,
              ycol = cols.y,
              chart = false,
              w=(ca.outerWidth()*0.95),
              h=300,
              _data=[],
              _labels=[],
              r = Raphael("g-"+graph_number, w, h);

          ca.addClass('graph-loaded');

          for(var i in data){
            _data.unshift(data[i][ycol]);
            _labels.unshift(data[i][xcol]);
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