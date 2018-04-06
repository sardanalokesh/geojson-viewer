'use strict';

const REST_URL = "http://localhost:8888"

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyZGFuYWxva2VzaCIsImEiOiJjamM0bWYyMzgwd2ZrMndtbTFjODB6bjhsIn0.fgzXP2ZCimQUDOoSjabWWA';
var map;

document.addEventListener("DOMContentLoaded", function(event) {
    var fileUploader = document.getElementById("fileUploader");
    fileUploader.addEventListener("change", event => {
        if (!window.FileReader) {
            alert("Browser not supported for this functionality");
            return;
        }
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
            hideLoader();
            let geojson = createGeojson(JSON.parse(e.target.result));
            console.log(geojson);
            update(geojson);
        };
        reader.onerror = function(e) {
            console.error("An error occurred while uploading file", e);
        };
        reader.readAsText(file);
        showLoader();
    });
});

function createGeojson(points) {
    let geojson = {
        type: "FeatureCollection",
        features: []
    };
    points.forEach(point => {
        geojson.features.push({
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: point
            }
        });
    });
    return geojson;
}

function update(geojson) {

    if (map) map.remove();

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/sardanalokesh/cjdead20tee572rlca70kz35q',
        preserveDrawingBuffer: true
    });

    map.on('load', () => {
    	if (!geojson) return;
        map.addSource('markers', {
            "type": "geojson",
            "data": geojson
        });
        
        let layer = {
          id: "marker-layer",
          type: "symbol",
          source: "markers",
          layout: {
            "icon-image": "marker-15",
            "icon-size": 1.2,
            "icon-allow-overlap": true,
            "icon-anchor": "bottom",
            "icon-padding": 0
          },
          paint: {
            "icon-translate": [0,3]
          }
        };

        map.addLayer(layer);

        let bounds = getBounds(geojson);
        map.fitBounds(bounds.toArray(), {
            linear: true,
            easing: function() {return 1;},
            padding: {
                top: 0.1*map.getCanvas().clientHeight,
                bottom: 0.1*map.getCanvas().clientHeight,
                left: 0.1*map.getCanvas().clientWidth,
                right: 0.1*map.getCanvas().clientWidth
            }
        });
    });
}

function getBounds(geojson) {
    let coordinates = [];
    geojson.features.forEach(feature => {
        if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates.forEach(coordGrp => {
                coordinates = coordinates.concat(coordGrp);
            });
        } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach(polygonCoord => {
                polygonCoord.forEach(coordGrp => {
                    coordinates = coordinates.concat(coordGrp);
                });
            });
        } else if (feature.geometry.type === "Point") {
            coordinates.push(feature.geometry.coordinates);
        } else {
            console.error("Unsupported geometry type");
        }
    });
    let bounds = coordinates.reduce(function(bounds, coord) {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    return bounds;        
}

function showLoader() {
    $("#loader").css("display", "flex");
}

function hideLoader() {
    $("#loader").css("display", "none");
}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300 && xhr.response) {
            callback(xhr.response);
        }
    };
    xhr.send();
}






