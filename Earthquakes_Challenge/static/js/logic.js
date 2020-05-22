
// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: mapbox_key
});

// We create the dark view tile layer that will be an option for our map.
let satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: mapbox_key
});

// We create the dark view tile layer that will be an option for our map.
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: mapbox_key
});


// Create a base layer that holds both maps.
let baseMaps = {
  Streets: streets,
  Satellite: satellite,
  Light: light
};

function styleInfo(feature) {
  return {
    fillOpacity: 0.6,
    color: getColor(feature.properties.mag),
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude*4;
}


// This function determines the color of the circle based on the magnitude of the earthquake.
function getColor(magnitude) {
  if (magnitude > 5) {return "#ea2c2c";}
  if (magnitude > 4) {return "#ea822c";}
  if (magnitude > 3) {return "#ee9c00";}
  if (magnitude > 2) {return "#eecc00";}
  if (magnitude > 1) {return "#d4ee00";}
  return "#98ee00";
}

// Accessing the Toronto neighborhoods GeoJSON URL.
let quakedata = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Grabbing our GeoJSON data.
d3.json(quakedata).then(function(data) {
  console.log(data);
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      console.log(data);
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);
});


// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

let plates = new L.layerGroup();

let tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Grabbing our GeoJSON data.
d3.json(tectonic).then(function(data) {
  console.log(data);
  L.geoJson(data, {color:'rgb(134, 108, 196)', weight:3, dashArray: '5,10'
  }).addTo(plates);
});


// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  "Tectonic Plates": plates,
  "Earthquakes": earthquakes 
};

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [0,0],
	zoom: 3,
  layers: [streets, plates, earthquakes]
})
// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps,overlays).addTo(map);




var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
    magnitudes = [0, 1, 2, 3, 4, 5];
    colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);