/**
 * EXTEND OBBMAP TO HAVE SWITCHABLE LAYERS
 */
ObbFilterMap.inherits(ObbMap);
function ObbFilterMap(){
	/**
	 * overwrite - more advanced items need to be pulled in via alternative feed rather than kml and 
	 * create individual marker points for each one
	 */
	this.load_data = function(){
		//if this is set then use the json method, otherwise
		if(this.marker_url){
			var obj = this;
			$.ajax({
				type: "GET",
				dataType: "json",
				url: this.marker_url,
				success: function(res){obj.load_from_json(res);},
				error: function(request, status, error_code){obj.failed(request, status, error_code);}
			});
		}else this.failed(false, "404", "no marker url was set"); //fail
	}
	
}
ObbFilterMap.prototype.google_bubble_name = "div.gmnoprint";
ObbFilterMap.prototype.options_panel = "obb_map_option_bar";
ObbFilterMap.prototype.markers = false; //markers json array
ObbFilterMap.prototype.marker_url = false; //url to get the xml from to parse with GXml
ObbFilterMap.prototype.map_filters = "obb_map_filter_options"; //filter side options
ObbFilterMap.prototype.filter_form_id = "obb_map_filters"; //filter form
ObbFilterMap.prototype.map_layers = undefined; //all the layers in use on the map - grouped by data_type
ObbFilterMap.prototype.side_bar_container = "obb_map_side_bar";
ObbFilterMap.prototype.selected_marker = undefined;
ObbFilterMap.prototype.zoomed_in_level = 9;
ObbFilterMap.prototype.zoom_on_click = false; //when true clicking on an icon zooms to the above level as well as centring
ObbFilterMap.prototype.side_bar_title = "Places";
ObbFilterMap.prototype.filter_block_title = "Filter By";


//over ride the failed function to show a message from the ajax call
ObbFilterMap.prototype.failed = function(request, status, error){alert("Failed to load markers ("+status+ " "+error+")");}
//create a marker element with a custom icon image and return it
ObbMap.prototype.create_marker = function(marker, latlng){
	var gicon = new GIcon(G_DEFAULT_ICON);
	gicon.image = marker.icons.normal;
	return new GMarker(latlng, {icon:gicon});	
}
/**
 * this function uses the contents of the json passed in to add everything to the map
 * and creates the layers array
 */
ObbFilterMap.prototype.load_from_json = function(json){
	this.markers = json;
	for(var position in this.markers){
		//create the marker using a function and assign to the main array
		this.markers[position].glatlng = new GLatLng(this.markers[position].longitude, this.markers[position].latitude);
		this.markers[position].marker = this.create_marker(this.markers[position], this.markers[position].glatlng);
		this.create_tabbed_window(position);
		var facilities = this.markers[position].facilities, marker_key = this.markers[position].primval;
		//add to map
		if(this.markers[position].visible) this.g_map.addOverlay(this.markers[position].marker);
		for(var acc_key in facilities){
			if(typeof(this.map_layers) == "undefined") this.map_layers = {}; //first time round create the hash
			if(typeof(this.map_layers[acc_key]) == "undefined") this.map_layers[acc_key] = {name: acc_key, markers: {}}; //if this is the first then create the hash
			//append the marker thats just been created to the layers array
			if(facilities[acc_key] == 1) this.map_layers[acc_key].markers[marker_key] = marker_key;
		}		
	}
	
	this.after_json_loaded();
}
/**
 * when the json has been fully loaded in then these actions are run
 */
ObbFilterMap.prototype.after_json_loaded = function(){
	/**
	 * as this is called from ajax then we need to add the filter 
	 * block etc in here otherwise the array being used will be empty	
	 */
	this.add_filter_block();
	//set up the filtering actions
	this.filter_actions();
	//add the list of markers on
	this.add_side_bar();
	//this sets up the jquery triggers for the side bar
	this.side_bar_actions();
	//the toggle effects
	this.tooglers();
}
/**
 * uses the layer passed in to create an infoWindow - tabbed!
 */
ObbFilterMap.prototype.create_tabbed_window = function(pos){
	var obj = this, layer = this.markers[pos];
	GEvent.addListener(layer.marker, "click", function() {
		obj.open_marker(pos);
		if(obj.zoom_on_click) obj.g_map.setZoom(obj.zoomed_in_level);
	});	
}
/**
 * this is what is called when a marker is clicked on or a side panel item is clicked
 * it inserts a new marker with a seperate icon over the current icon and then
 * calls a function to handle the side bar update
 */
ObbFilterMap.prototype.open_marker = function(pos){
	this.handle_infowindow_icon(pos);
	this.handle_sidebar_icon_change(pos);
}
ObbFilterMap.prototype.handle_infowindow_icon = function(pos){
	var layer = this.markers[pos];
	var obb_selected_icon = new GIcon(G_DEFAULT_ICON);	
	obb_selected_icon.image = layer.icons.selected;	
	if(typeof(this.selected_marker) !="undefined") this.g_map.removeOverlay(this.selected_marker);
	layer.marker.openInfoWindowTabsHtml([new GInfoWindowTab("Details",layer.desc), new GInfoWindowTab('Hours',layer.opening_hours)]);	
	this.selected_marker = new GMarker(new GLatLng(layer.longitude, layer.latitude),{icon:obb_selected_icon});	
	this.g_map.addOverlay(this.selected_marker);
}
/**
 * This gets called in order to update the markers in the side bar showing which is active etc
 */
ObbFilterMap.prototype.handle_sidebar_icon_change = function(pos){
	if($('#'+this.side_bar_container + ' li img.selected_obb_map_dealer_icon').length){
		var currently_selected_rel = $('#'+this.side_bar_container + ' li img.selected_obb_map_dealer_icon').attr('rel');
		var currently_selected_src = $('#'+this.side_bar_container + ' li img.selected_obb_map_dealer_icon').attr('src');
		$('#'+this.side_bar_container + ' li img.selected_obb_map_dealer_icon').attr('src', currently_selected_src.replace("selected", currently_selected_rel));		
	}
	$('#'+this.side_bar_container + ' img').removeClass('selected_obb_map_dealer_icon');
	
	if(typeof(pos) != "undefined"){
		var layer = this.markers[pos];
		$('#'+this.side_bar_container + ' li#side_'+pos+' img.obb_map_dealer_icon').attr('src', layer.icons.selected).addClass('selected_obb_map_dealer_icon');
	}
}

/**
 * if the filter block div does not exist then this inserts it in the mark up; also loops over all the map layers that
 * have been recorded and creates a form option for them
 */
ObbFilterMap.prototype.add_filter_block = function(){
	if(!$('#'+this.map_filters).length){
		$('#'+this.options_panel).append('<h4 class="toggler"><a href="#'+this.map_filters+'" rel="#'+this.map_filters+'">'+this.filter_block_title+'</a></h4><div id="'+this.map_filters+'" class="google_map_inserted clearfix"><form action="" method="post" id="'+this.filter_form_id+'"><ol class="clearfix"></ol></form></div>');
		for(var layer in this.map_layers) {
			$('#'+this.filter_form_id + ' ol').append("<li><input type='checkbox' value='"+layer+"' checked='checked' name='filter[]' id='"+layer+"' class='ochecked'/><label for='"+layer+"'>"+this.map_layers[layer].name+"</label></li>");
		}
	}
}
/**
 * simply inserts the side bar in to the html structure of the doc and the list items inside of it
 */
ObbFilterMap.prototype.add_side_bar = function(){
	if(!$('#'+this.side_bar_container).length){
		$('#'+this.options_panel).append('<h4 class="toggler"><a href="#'+this.side_bar_container+'" rel="#'+this.side_bar_container+'">'+this.side_bar_title+'</a></h4><div id="'+this.side_bar_container+'" class="google_map_inserted"><ol></ol></div>');
		for(var layer in this.markers){
			$('#'+this.side_bar_container + ' ol').append('<li id="side_'+layer+'" class="obb_map_dealer_side clearfix">'+this.markers[layer].summary+'</li>');
		}
	}
}
/**
 * trigger a google event on click of the side bar
 */
ObbFilterMap.prototype.side_bar_actions = function(){
	var obj = this;
	$('a.obb_map_move_to').click(function(){
		var mrk = $(this).attr('href').substring(1);
		GEvent.trigger(obj.markers[mrk].marker, "click");
		return false;
	});
}
/**
 * turn on or off a layer on the map; as layers can be loaded via kml or json request data
 * check for which way this layer was created and act accordingly
 */
ObbFilterMap.prototype.hide_layer = function(layer){
	if(typeof(layer) != "undefined" && layer.visible){
		if(typeof(layer.marker) != "undefined")	this.g_map.removeOverlay(layer.marker);
		else if(typeof(layer.geo) != "undefined")	this.g_map.removeOverlay(layer.geo);
		$('#'+this.side_bar_container+' li#side_'+layer.primval).hide();
	}
	
}

ObbFilterMap.prototype.show_layer = function(layer){
	if(typeof(layer) != "undefined" && !layer.visible){
		if(typeof(layer.marker) != "undefined")	this.g_map.addOverlay(layer.marker);
		else if(typeof(layer.geo) != "undefined")	this.g_map.addOverlay(layer.geo);
		$('#'+this.side_bar_container+' li#side_'+layer.primval).show();
	}
}
/**
 * after the form options have been inserted this gets called to trigger the correct filtering actions
 */
ObbFilterMap.prototype.filter_actions = function(){
	var map_layers = this.map_layers, filter_form_id = this.filter_form_id, obj = this;
	//when inside a click function etc this now longer works, so use the obj declared above
	$('#'+this.filter_form_id + ' ol input[type=checkbox]').click(function(){	
		//this adds a temp class as otherwise the fact this input isnt checked till after this function completes
		if($(this).hasClass('ochecked')) $(this).removeClass('ochecked');
		else $(this).addClass('ochecked');
		//loop over the checkboxes and find all ticked ones - this is so we can compare to the layer listing 
		var layers_needed = new Array, markers_needed = {};
		$('#'+filter_form_id + ' input[type=checkbox]').each(function(){
			if($(this).attr('checked') || $(this).hasClass('ochecked')) layers_needed[this.id] = true;	
		});
		//now we know what layers are needed we need to pull from the layer list what markers are used for that category
		for(var type in layers_needed){
			var omarkers = obj.map_layers[type].markers;
			for(var nm in omarkers) markers_needed[nm] = omarkers[nm]; 
		}
		//remove selected marker layers
		if(typeof(obj.selected_marker) != "undefined"){
			obj.g_map.removeOverlay(obj.selected_marker); //remove any selected layers!
			obj.handle_sidebar_icon_change();
		}
		//now loop over all markers to see if they should be shown or not, toggle then accordingly
		for(var pos in obj.markers){
			if(typeof(markers_needed[pos]) != "undefined"){
				obj.show_layer(obj.markers[pos]);//show the layer
				obj.markers[pos].visible = true; //set it to visible
			}else if(typeof(markers_needed[pos]) == "undefined"){
				obj.hide_layer(obj.markers[pos]); //hide
				obj.markers[pos].visible = false; //set visible to false
			}
		}
	});
}
/**
 * toogle function to slide containers up and down
 */
ObbFilterMap.prototype.tooglers = function(){
	var obj = this;
	$('.toggler a').click(function(){
		obj.toggle(this.rel, this);
		return false;
	});	
}
ObbFilterMap.prototype.toggle = function(toggle_div, a_ele){
	if($(toggle_div).hasClass('toggle_hidden')) this.toggle_show(toggle_div, a_ele);
	else this.toggle_hide(toggle_div, a_ele);
}
ObbFilterMap.prototype.toggle_show = function(toggle_div, a_ele){
	$(a_ele).removeClass('obb_hide');
	$(toggle_div).slideDown('fast').removeClass('toggle_hidden');
}
ObbFilterMap.prototype.toggle_hide = function(toggle_div, a_ele){
	$(a_ele).addClass('obb_hide');
	$(toggle_div).slideUp('fast').addClass('toggle_hidden');
}