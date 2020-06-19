// Load in geojson data
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
magnitudes = []

// Grab data with d3
d3.json(earthquakeData, function (response) {

    L.geoJSON(response, {
        onEachFeature: function(feature, layer) {
            magnitudes.push(
                L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                    stroke: false,
                    fillOpacity: 0.9,
                    color: "white",
                    fillColor: "red",
                    radius: (feature.properties.mag * 10000)
                })
            )
            layer.bindPopup("<strong>Location:</strong> " + feature.properties.place + "<br><strong>Magnitude:</strong>" + feature.properties.mag);
        }
      })
});

var platesData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
plates = []

d3.json(platesData, function (response) {
    L.geoJSON(response, {
        onEachFeature: function(feature, layer) {
            plates.push(
                L.polygon(feature.geometry.coordinates, {
                    color: "orange",
                    fillColor: "none",
                    fillOpacity: 0.9
                  })
            )
        }
    });
});

// Adds satellite tile layer
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
})

// Adds greyscale tile layer
var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
})

// Adds outdoor tile layer
var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
})

// Create layer group for magnitude circle
var magLayer = L.layerGroup(magnitudes);

// Create layer group for plate boundaries polygons
var platesLayer = L.layerGroup(plates);

// Create a baseMaps object to contain the streetmap and darkmap
var baseMaps = {
    Satellite: satelliteMap,
    Grayscale: grayMap,
    Outdoors: outdoorMap
};

// Create an overlayMaps object here to contain the "State Population" and "City Population" layers
var overlayMaps = {
    Fault_Lines: platesLayer,
    Earthquakes: magLayer
};

// Creating map object
var myMap = L.map("map", {
    center: [41.8780, -93.0977],
    zoom: 3,
    layers: [satelliteMap, magLayer]
});

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);