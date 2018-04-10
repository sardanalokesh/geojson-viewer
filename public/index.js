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
            let geojson = JSON.parse(e.target.result);
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

function update(geojson) {

    if (map) map.remove();

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/sardanalokesh/cjdead20tee572rlca70kz35q',
        center: [-98.585522,37.8333333],
        zoom: 3,
        preserveDrawingBuffer: true
    });

    map.on('load', () => {
    	if (!geojson) return;
        map.addSource('region-boundaries', {
            "type": "geojson",
            "data": geojson
        });
        
        let polygonLayer = {
          "id": "polygonLayer",
          "type": "fill",
          "source": 'region-boundaries',
          "paint": {
            "fill-color": "#ffffff",
            "fill-opacity": 0.5,
            "fill-outline-color": "#ff0000",
          }
        };

        map.addLayer(polygonLayer, 'waterway-label');

        let popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.on('mousemove', 'polygonLayer', event => {
            map.getCanvas().style.cursor = 'pointer';
            let html = '<table><tbody>';
            for (let p in event.features[0].properties) {
                html += '<tr><td>' + p + '</td><td>' + event.features[0].properties[p] + '</td></tr>';
            }
            popup.setLngLat(event.lngLat)
            .setHTML(html)
            .addTo(map);

        });

        map.on('mouseleave', 'polygonLayer', event => {
            map.getCanvas().style.cursor = '';
            if (popup.isOpen()) popup.remove();
        });

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






