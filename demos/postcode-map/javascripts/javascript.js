function initialize() {
  var uk = new google.maps.LatLng(52.494069,-1.890442);
  var mapOptions = {
    zoom: 13,
    center: uk,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('googlemap'), mapOptions);

  var ctaLayer = new google.maps.KmlLayer({
    url: 'http://charlesmarshall.co.uk/demos/postcode-map/kml/birmingham.kml'
  });
  ctaLayer.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
