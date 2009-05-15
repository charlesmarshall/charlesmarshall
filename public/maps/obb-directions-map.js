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
			tab_3 = new GInfoWindowTab('Directions', layer.directions.replace('<form', '<form onsubmit="return '+this.map_variable_name+'.directions_actions(this);"') );	
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
