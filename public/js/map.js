  mapboxgl.accessToken =map_t;
  var map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: camp.geometry.coordinates, // starting position [lng, lat]
  zoom: 11 // starting zoom
  });
  var marker = new mapboxgl.Marker({
    color: "#9B2335",
    draggable: true
    }).setLngLat( camp.geometry.coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h1>${camp.title}</h1><p>${camp.location}</p>`)) 
    .addTo(map);