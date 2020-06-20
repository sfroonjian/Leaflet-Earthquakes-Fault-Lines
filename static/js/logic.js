// Load in geojson data
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
magnitudes = []

var platesData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
plates = []

colors = ["#b7f34e", "#e1f34c", "#f3db4c", "#f3ba4e", "#f0a76c", "#f16b6b"]

var geojson;

// Grab data with d3
d3.json(earthquakeData, function (response1) {
    d3.json(platesData, function (response2) {

        L.geoJSON(response1, {
            onEachFeature: function (feature, layer) {

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

                magnitudes.push(
                    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                        stroke: true,
                        weight: 1,
                        fillOpacity: 0.9,
                        color: "black",
                        fillColor: color,
                        radius: (feature.properties.mag * 50000)
                    })
                        .bindPopup("<strong>Location:</strong> " + feature.properties.place + "<br><strong>Magnitude:</strong> " + feature.properties.mag)
                )
            }
        })

        L.geoJSON(response2, {
            onEachFeature: function (feature, layer) {

                var coordinates = []
                for (var i = 0; i < feature.geometry.coordinates.length; i++) {
                    coordinates.push([feature.geometry.coordinates[i][1], feature.geometry.coordinates[i][0]])
                };

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

        console.log(magnitudes);

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

        var info = L.control({
            position: "bottomright"
        });
    
        info.onAdd = function () {
            var div = L.DomUtil.create("div", "legend");
            return div;
        };
        // Add the info legend to the map
        info.addTo(myMap);

        updateLegend();
    });
});


function updateLegend() {

    var svg = d3
        .select(".legend")
        .append("svg")

    svg.selectAll("rect")
        .data(colors)
        .enter()
            .append("rect")
            .attr("x", 10)
            .attr("y", 10)
            .attr("fill", d => d)
            .attr("opacity", "1");
    
    document.querySelector(".legend").innerHTML = [
        "<p class='legend-title'><strong>Magnitude</strong></p>",
        "<p class='squares'><svg class='square zero'></svg>0-1</p>",
        "<p class='squares'><svg class='square one'></svg>1-2</p>",
        "<p class='squares'><svg class='square two'></svg>2-3</p>",
        "<p class='squares'><svg class='square three'></svg>3-4</p>",
        "<p class='squares'><svg class='square four'></svg>4-5</p>",
        "<p class='squares'><svg class='square five'></svg>5+</p>",
    ].join("");
}