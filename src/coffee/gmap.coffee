window.GMap =
  options:
    zoom: 4
    center: new google.maps.LatLng(-41,174)
    mapTypeId: 'greymap'
    mapTypeControlOptions:
      mapTypeIds:["greymap",google.maps.MapTypeId.HYBRID,google.maps.MapTypeId.TERRAIN]
    navigationControl:false
    streetViewControl:false

  custom_style:[{
    featureType: "landscape"
    elementType: "all"
    stylers: [{ lightness: -100 },{ saturation: -100 }]
  },{
    featureType: "water",
    elementType: "all",
    stylers: [{ saturation: -100 },{ lightness: -40 }]
  },{
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },{
    featureType: "administrative",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },{
    featureType: "road",
    elementType: "all",
    stylers: [{ saturation: -100 }]
  },{
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  },{
    featureType: "all",
    elementType: "all",
    stylers: [{ lightness: 40 }]
  }]
