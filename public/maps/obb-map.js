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
