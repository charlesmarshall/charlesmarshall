/** EXTEND FUNCTIONS **/
Function.prototype.inherits = function(parent){
	this.prototype = new parent();
	this.prototype.constructor = this;
	this.prototype.parent = parent.prototype;
}
/** simple map class **/
function ObbMap(){	
	/**
	 * PRIVILEGED
	 */	
	//start up functions
	this.init = function(){
		this.setup();
		this.g_map = new google.maps.Map2(document.getElementById(this.map_name));
		this.g_map.setCenter(new GLatLng(this.start_longitude, this.start_latitude), this.start_zoom);
		this.g_map.setUIToDefault();
		if(this.mouse_wheel_scroll) this.g_map.enableScrollWheelZoom();
		if(this.street_view) this.g_map.addOverlay(new GStreetviewOverlay());
		if(this.earth) this.g_map.addMapType(G_SATELLITE_3D_MAP);
		this.g_map_manager = new GMarkerManager(this.g_map)
		this.load_data();
		this.after();
	}
	//load all layers in
	this.load_data = function(){
		for(var layer in this.map_layers) {
			this.load_kml(layer);
		}
	}
	//load the points in from the kml file
	this.load_kml = function(position){
		var maplayers = this.map_layers, gmap = this.g_map, geoxml = new GGeoXml(maplayers[position].url), viewportlock = this.default_kml_viewport;
	  var overlayLoadedEvent = GEvent.addListener(geoxml, "load", function(){
			if (geoxml.hasLoaded()){
				maplayers[position].geo = geoxml;
				if(viewportlock) geoxml.gotoDefaultViewport(gmap);
				gmap.addOverlay(geoxml); 
			}
	  });
	}
	/**
	 * PRIVATE
	 */	
	var g_map = false;
	if(!this.dependancies() || !this.is_compatible()) this.failed('Please make sure you have included all dependancies');
}

/** 
 * PUBLIC 
 */
ObbMap.prototype.map_variable_name = "my_map";
ObbMap.prototype.google_bubble_name = "#iw_kml";
ObbMap.prototype.map_name = "dealer_map"; //the div being used for the map
ObbMap.prototype.start_longitude = false;
ObbMap.prototype.start_latitude = false;
ObbMap.prototype.mouse_wheel_scroll = true; //allow mouse scroll wheel zooming
ObbMap.prototype.earth = false; //include the google earth plugin option
ObbMap.prototype.start_zoom = 6; //initial zoom level
ObbMap.prototype.default_kml_viewport = false; //warning: using this locks the viewport and disables zoom etc
ObbMap.prototype.use_navigational_controlls = true;
ObbMap.prototype.use_map_type_controlls = true;
ObbMap.prototype.street_view = false; 
/**
 * FUNCTIONS USED BY ObbMap
 */
//failure message function
ObbMap.prototype.failed = function(msg){alert(msg);}
//make sure everything thats need is loaded
ObbMap.prototype.dependancies = function(){
	if(typeof(GBrowserIsCompatible) == "function" && typeof(jQuery) != "undefined") return true;
	else return false;
}
//use the google compatibility check
ObbMap.prototype.is_compatible = function(){return GBrowserIsCompatible();}
//insert the map div if its not there
ObbMap.prototype.setup = function(){
	if(!$('#'+this.map_name).length) $('body div:first').append("<div id='"+this.map_name+"' class='google_map_inserted'></div>"); 
}
//empty hook
ObbMap.prototype.after = function(){}

ObbMap.prototype.start_loading = function(div_id){
	$(div_id).fadeTo('fast', 0.6, function(){
		$(this).addClass('obb_map_loading');
	});
}
ObbMap.prototype.stop_loading = function(div_id){
	$(div_id).fadeTo('fast', 1, function(){
		$(this).removeClass('obb_map_loading');
	});
}


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



/**
 * EXTEND THE FILTER MAP TO HAVE DIRECTIONS
 */
ObbDirectionsMap.inherits(ObbFilterMap);
function ObbDirectionsMap(){}

ObbDirectionsMap.prototype.directions_container = "directions_sidebar";
ObbDirectionsMap.prototype.directions_form_rel = "obb_map_directions";
ObbDirectionsMap.prototype.directions_panel = undefined;
ObbDirectionsMap.prototype.directions_container_title = "Directions";
/**
 * load all the json data in
 */
ObbDirectionsMap.prototype.after_json_loaded = function(){
	this.add_filter_block();
	this.filter_actions();
	this.add_side_bar();
	this.side_bar_actions();
	this.add_directions_container();
	this.tooglers();
}

/**
 * Over write the ObbFilter version and add an extra tab for directions.
 */
ObbDirectionsMap.prototype.handle_infowindow_icon = function(pos){
	var layer = this.markers[pos];
	var obb_selected_icon = new GIcon(G_DEFAULT_ICON);	
	obb_selected_icon.image = layer.icons.selected;	
	if(typeof(this.selected_marker) !="undefined") this.g_map.removeOverlay(this.selected_marker);
	var tab_1 = new GInfoWindowTab("Details",layer.desc), 
			tab_2 = new GInfoWindowTab('Hours',layer.opening_hours), 
			//really ugly way to capture the form submit .. wish i could find a nicer way then forcing an on submit function!
			tab_3 = new GInfoWindowTab('Directions', layer.directions.replace('<form', '<form onsubmit="return '+this.map_name+'.directions_actions(this);"') );	
	layer.marker.openInfoWindowTabsHtml([tab_1, tab_2, tab_3], {maxWidth:450});	
	this.selected_marker = new GMarker(new GLatLng(layer.longitude, layer.latitude),{icon:obb_selected_icon});	
	this.g_map.addOverlay(this.selected_marker);
}
/**
 * insert the directions listing
 */
ObbDirectionsMap.prototype.add_directions_container = function(){
	if(!$('#'+this.directions_container).length){
		$('#'+this.options_panel).append('<h4 class="toggler directions_toggle"><a href="#'+this.directions_container+'" rel="#'+this.directions_container+'">'+this.directions_container_title+'</a></h4><div id="'+this.directions_container+'" class="google_map_inserted clearfix"></div>');
		$('.directions_toggle, #'+this.directions_container).hide();
		this.directions_panel = new GDirections(this.g_map, document.getElementById(this.directions_container));
	}
}
/**
 * sort out the directions! google rocks... 
 */
ObbDirectionsMap.prototype.directions_actions = function(form_posted){
	var form_rel = $(form_posted).attr('rel'), 
			layer_key = $(form_posted).find('input[name=obb_map_layer]').val(), 
			from_pos = $(form_posted).find('input[name=obb_map_from]').val(), 
			to_pos = $(form_posted).find('input[name=obb_map_to]').val(),
			cmd = "to: "+from_pos+" from: "+to_pos+", UK";
				
	if(form_rel == this.directions_form_rel && typeof(this.directions_panel) != "undefined"){
		//remove open info windows
		this.g_map.closeInfoWindow();
		//remove selected icon marker
		if(typeof(this.selected_marker) !="undefined") this.g_map.removeOverlay(this.selected_marker);
		//hide sidebar & filters
		$('#'+this.map_filters+', #'+this.side_bar_container).hide().addClass('toggle_hidden');
		//load in directions
		this.directions_panel.load(cmd, {"locale": "en_UK"});	
		$('h4.toggler a').addClass('obb_hide');
		$('.directions_toggle').show();
		$('h4.directions_toggle a').removeClass('obb_hide');
		$('#'+this.directions_container).slideDown('fast');	
	}
	return false;
}

/**
 * EXTEND THE DIRECTIONS MAP TO HAVE SEARCHING
 */
ObbSearchMap.inherits(ObbDirectionsMap);
function ObbSearchMap(){}

ObbSearchMap.prototype.search_form = ObbSearchMap.prototype.filter_form_id; //the search form should be the same as the filter form
ObbSearchMap.prototype.search_box_name = "obb_map_search_box"; //the id of the text box
ObbSearchMap.prototype.filter_block_title = "Search"; //the title to use
ObbSearchMap.prototype.search_marker = undefined; //the gmarker
ObbSearchMap.prototype.search_marker_icon = undefined; //will use another icon for search point - image path
ObbSearchMap.prototype.min_zoom = 5; //how far zoomed out the search bounding query is allowed to go
ObbSearchMap.prototype.max_zoom = 17; //how close zoomed in the search bounding goes

ObbSearchMap.prototype.search_locale = "UK"; //force the uk on the end of the search queries to make sure it finds the right place
//for switching scales later
ObbSearchMap.prototype.mile = 1609.344; //how many metres in a mile
ObbSearchMap.prototype.km = 1000; //how many metres in a kilometre
ObbSearchMap.prototype.scale = ObbSearchMap.prototype.mile; //use miles for the scale - switchable
ObbSearchMap.prototype.miles_name = "miles"; //the name of the scale
ObbSearchMap.prototype.km_name = "km"; //the name of the scale
ObbSearchMap.prototype.scale_name = ObbSearchMap.prototype.miles_name; //by default we're using miles
/**
 * Overwite to have a search box
 */
ObbSearchMap.prototype.add_filter_block = function(){
	if(!$('#'+this.map_filters).length){
		$('#'+this.options_panel).append('<h4 class="toggler"><a href="#'+this.map_filters+'" rel="#'+this.map_filters+'" class="toogle_header_'+this.map_filters+'">'+this.filter_block_title+'</a></h4><div id="'+this.map_filters+'" class="google_map_inserted clearfix"><form action="" method="post" id="'+this.filter_form_id+'"><ul class="'+this.search_box_name+'_list"><li><label for="'+this.search_box_name+'">Search</label><input type="text" name="'+this.search_box_name+'" id="'+this.search_box_name+'" class="text_field"/><input type="submit" name="'+this.search_box_name+'_submit" value="Go" class="submit_form" /></li></ul><ol class="clearfix filters"></ol></form></div>');
		for(var layer in this.map_layers) {
			$('#'+this.filter_form_id + ' ol').append("<li><input type='checkbox' value='"+layer+"' checked='checked' name='filter[]' id='"+layer+"' class='ochecked'/><label for='"+layer+"'>"+this.map_layers[layer].name+"</label></li>");
		}
	}
	this.search_form_listener();
}
/**
 * change this function so the dealers listing is hidden on start
 */
ObbDirectionsMap.prototype.after_json_loaded = function(){
	this.add_filter_block();
	this.filter_actions();
	this.add_side_bar();
	this.side_bar_actions();
	this.add_directions_container();
	this.tooglers();
	this.toggle('#'+this.side_bar_container, 'a[rel=#'+this.side_bar_container+']');
}
/**
 * change the open marker to remove any search markers
 */
ObbDirectionsMap.prototype.open_marker = function(pos){
	this.handle_infowindow_icon(pos);
	this.handle_sidebar_icon_change(pos);
	if(typeof(this.search_marker) != "undefined") this.g_map.removeOverlay(this.search_marker);
}
/**
 * listen for the form submit of the search box and pass the value down to the search function
 */
ObbSearchMap.prototype.search_form_listener = function(){
	var obj = this;
	$('#'+this.search_form).submit(function(){
		var search_for = $(this).find('#'+obj.search_box_name).val();
		if(search_for.length) obj.search(search_for);
		return false;
	});	
}
/**
 * the search function uses the very cool geocoder to find the the lng & lat 
 * of the searched for text. Re orders all the markers into distance order; 
 * calculate the bounds based on the initial point and then add the first 2 
 * markers into the bounding as long as the zoom level is within the set
 * levels. creates a new icon representing the searched_for point and adds
 * it to the map. Based on the bounding calculations the map is then 
 * re-centred and zoomed in the right level
 */
ObbSearchMap.prototype.search = function(search_for){
	var obj = this, geocoder = new GClientGeocoder();
	geocoder.getLatLng(search_for+', '+obj.search_locale, function(point){
		if(point){			
			var i=0, ordering = new Array(), markers = {};
			//loop over all the markers and store them
			for(var pos in obj.markers){
				var dist = parseFloat(point.distanceFrom(obj.markers[pos].glatlng)), array_ind = obj.markers[pos].primval.toString();
				obj.markers[pos].distance_from_search_point = dist;
				ordering[i] = dist;
				markers[dist] = pos;
				i++;
			}
			//sort the new array by the distance ascending
			ordering = ordering.sort(obj.number_sort); //sort the results!
			//create a new bounding object
			var bounds = new GLatLngBounds(), zoom = obj.g_map.getZoom(), cnt = 0;
			bounds.extend(point); //add the search point to the bounding
			/**
			 * the purpose of this is to find an optimal zoom level and position for the searched for location 
			 * to be visible along with two other data points
			 */
			while(zoom >= obj.min_zoom && zoom <= obj.max_zoom && cnt < 2){ //only do the first 2 points
				var ord = ordering[cnt], ind = markers[ord], latlng = obj.markers[ind].glatlng;
				bounds.extend(latlng);
				zoom = obj.g_map.getBoundsZoomLevel(bounds);
				cnt++;
			}			
			//add pointers and remove old ones
			var icon = new GIcon(G_DEFAULT_ICON);
			if(typeof(obj.search_marker_icon) != "undefined") icon.image = obj.search_marker_icon;				
			if(typeof(obj.search_marker) != "undefined") obj.g_map.removeOverlay(obj.search_marker);
			if(typeof(obj.selected_marker) !="undefined"){
				obj.g_map.removeOverlay(obj.selected_marker);
				obj.g_map.closeInfoWindow();
			}
			
			obj.search_marker = new GMarker(point, {icon:icon});
			obj.g_map.addOverlay(obj.search_marker);
			//set the center to where they searched for
			obj.g_map.setCenter(point,zoom);
			//now we've got an ordered list - replace the side bar listing
			obj.replace_side_bar(ordering, markers);
			obj.toggle_show('#'+obj.side_bar_container, 'a[rel=#'+obj.side_bar_container+']');
			//as we just replaced all the side bar actions we now need to re call this
			obj.side_bar_actions();
		}
	});
}
//sorting function
ObbSearchMap.prototype.number_sort = function (a,b){return a - b;}
/**
 * with this we replace the existing dealer listing with a list ordered
 * by distance ascending
 */
ObbSearchMap.prototype.replace_side_bar = function(order, ordered_layers){
	this.start_loading('#'+this.side_bar_container);
	if($('#'+this.side_bar_container).length){
		var list_html = "<ol>";
		for(var i=0; i < order.length; i++){
			var distance = order[i], layer_key = ordered_layers[distance], scaled_distance = parseInt(distance / this.scale);
			list_html+='<li id="side_'+layer_key+'" class="obb_map_dealer_side clearfix">'+this.markers[layer_key].summary+'<p class="obb_map_distance">Distance: <strong>'+scaled_distance+' '+this.scale_name+'</strong></p></li>';			
		}
		list_html += "</ol>";
		this.stop_loading('#'+this.side_bar_container);
		$('#'+this.side_bar_container+' ol').replaceWith(list_html);
	}
}
