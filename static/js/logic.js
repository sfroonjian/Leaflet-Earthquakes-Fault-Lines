// Load in geojson earthquake data
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
magnitudes = []

// Load in geojson plate boundary data
var platesData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
plates = []

// list of colors to use for bubbles
colors = ["#b7f34e", "#e1f34c", "#f3db4c", "#f3ba4e", "#f0a76c", "#f16b6b"]

var geojson;

// Grab earthquake data with d3
d3.json(earthquakeData, function (quakeResponse) {
    // Grab plate boundary data with d3
    d3.json(platesData, function (plateResponse) {

        // reads the earthquake geojson
        L.geoJSON(quakeResponse, {
            // goes through each "feature" object in the geojson
            onEachFeature: function (feature, layer) {
                // sets the variable "color" to a certain color based on the magnitude
                var color = ""
                if (feature.properties.mag < 1) {
                    color = colors[0]
                } else if (feature.properties.mag >= 1 && feature.properties.mag < 2) {
                    color = colors[1]
                } else if (feature.properties.mag >= 2 && feature.properties.mag < 3) {
                    color = colors[2]
                } else if (feature.properties.mag >= 3 && feature.properties.mag < 4) {
                    color = colors[3]
                } else if (feature.properties.mag >= 4 && feature.properties.mag < 5) {
                    color = colors[4]
                } else {
                    color = colors[5]
                }

                // adds a circle for each earthquake in json by grabbing the coordinates
                magnitudes.push(
                    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        stroke: true,
                        weight: 1,
                        fillOpacity: 0.9,
                        color: "black",
                        fillColor: color,
                        // makes the radius of the circle based on the magnitude
                        radius: (feature.properties.mag * 50000)
                    })
                        // adds a pop up with info when you click on each circle
                        .bindPopup("<strong>Location:</strong> " + feature.properties.place + "<br><strong>Magnitude:</strong> " + feature.properties.mag)
                )
            }
        })

        // reads the plates geojson
        L.geoJSON(plateResponse, {
            // goes through each "feature" object in the geojson
            onEachFeature: function (feature, layer) {
                // this will hold the coordinates of every line segment for the plate boundaries
                var coordinates = []
                // for each feature, this will iterate though each set of coordinates and add them to the array
                for (var i = 0; i < feature.geometry.coordinates.length; i++) {
                    coordinates.push([feature.geometry.coordinates[i][1], feature.geometry.coordinates[i][0]])
                };
                // adds a line segement for each set of coordinates to an array
                plates.push(
                    L.polyline(coordinates, {
                        color: "blue",
                        fillColor: "none",
                        fillOpacity: 0.9
                    })
                )
            }
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

        // Create a baseMaps object to contain the different map views
        var baseMaps = {
            Satellite: satelliteMap,
            Grayscale: grayMap,
            Outdoors: outdoorMap
        };

        // Create an overlayMaps object here to contain the earthquake circles and fault lines
        var overlayMaps = {
            "Fault Lines": platesLayer,
            Earthquakes: magLayer
        };

        // Creates map object with default layers
        var myMap = L.map("map", {
            center: [41.8780, -93.0977],
            zoom: 3,
            layers: [satelliteMap, magLayer]
        });

        // adds all the map views and overlay layers
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(myMap);

        // creates area for the legend
        var info = L.control({
            position: "bottomright"
        });
    
        // creates a div in the html with the class "legend"
        info.onAdd = function () {
            var div = L.DomUtil.create("div", "legend");
            return div;
        };
        // Add the info legend to the map
        info.addTo(myMap);

        // calls the update legend function
        updateLegend();
    });
});


function updateLegend() {
    // selects the div with the class "legend"
    document.querySelector(".legend").innerHTML = [
        // adds a paragraph for each magnitude range
        // and an svg that will display a box with the corresponding color
        "<p class='legend-title'><strong>Magnitude</strong></p>",
        "<p class='key'><svg class='square zero'></svg>0-1</p>",
        "<p class='key'><svg class='square one'></svg>1-2</p>",
        "<p class='key'><svg class='square two'></svg>2-3</p>",
        "<p class='key'><svg class='square three'></svg>3-4</p>",
        "<p class='key'><svg class='square four'></svg>4-5</p>",
        "<p class='key'><svg class='square five'></svg>5+</p>",
    ].join("");
}