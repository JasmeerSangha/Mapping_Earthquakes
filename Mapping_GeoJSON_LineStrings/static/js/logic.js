// Create the map object with a center and zoom level.
let map = L.map('mapid').setView([44.0, -80.0], 2);

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: mapbox_key
});
// Then we add our 'graymap' tile layer to the map.
streets.addTo(map);

// Accessing the Toronto airline routes GeoJSON URL.
let torData = "https://raw.githubusercontent.com/JasmeerSangha/Mapping_Earthquakes/master/torontoRoutes.json";

// Grabbing our GeoJSON data.
d3.json(torData).then(function(data) {
    console.log(data);
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data).addTo(map);
});


