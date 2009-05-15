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
