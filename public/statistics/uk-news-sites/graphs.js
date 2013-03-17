var
  base_source = "/statistics/uk-news-sites/",
  data_sources = ["word-length", 'title-length'],
  graph_types = {"multiBarChart":"Bar chart", "lineChart":"Line chart"},
  current_graph_type = "multiBarChart",
  xlabels = {"word-length":"Word size"},
  ylabels = {"word-length": "% Occurrences"},
  graph_inits = {
    "lineChart": function(id, url, xlabel, ylabel){
      d3.json(url, function(data){
        nv.addGraph(function() {
          var chart = nv.models.lineChart();
          chart.xAxis.axisLabel(xlabel);
          chart.yAxis.axisLabel(ylabel);
          d3.select('#'+id+' svg').selectAll("*").remove();
          d3.select('#'+id+' svg').datum(data).transition().duration(100).call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        } );
      } );
    },
    "multiBarChart":function(id, url, xlabel, ylabel){
      d3.json(url, function(data){
        nv.addGraph(function() {
          var chart = nv.models.multiBarChart();
          chart.xAxis.axisLabel(xlabel);
          chart.yAxis.axisLabel(ylabel);
          chart.showControls(false);
          d3.select('#'+id+' svg').selectAll("*").remove();
          d3.select('#'+id+' svg').datum(data).transition().duration(100).call(chart);
          nv.utils.windowResize(chart.update);
          return chart;
        } );
      } );
    }
  };




jQuery(document).ready(function(){

  function render(){
    var base = base_source + jQuery("#year_week").val()+"/";
    for(var i in data_sources){
      var id = data_sources[i], url = base+id+".json";
      graph_inits[current_graph_type](id, url, xlabels[id], ylabels[id]);
    }
  }

  //graph types
  graphs = "";
  for(var type in graph_types) graphs += "<option value='"+type+"'>"+graph_types[type]+"</option>";
  //insert and monitor binds
  jQuery("#graph_type").html(graphs).on("change", function(){
    current_graph_type = jQuery(this).val();
    render();
  });

  //load the selects
  jQuery.ajax({
    url:"/statistics/uk-news-sites/listing.json",
    dataType:"json",
    success:function(data){
      var res ="";
      for(var year in data) for(var week in data[year]) res += "<option value='"+year+"/"+data[year][week]+"'>"+year+": week "+data[year][week]+"</option>";
      jQuery("#year_week").html(res).trigger("change");
    }
  });

  //on change, fetch data and trigger graphs
  jQuery("#year_week").on("change", function(){
    render();
  });

});
