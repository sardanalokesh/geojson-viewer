'use strict';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyZGFuYWxva2VzaCIsImEiOiJjamM0bWYyMzgwd2ZrMndtbTFjODB6bjhsIn0.fgzXP2ZCimQUDOoSjabWWA';
var map, selectedCountry = "au", selectedGranuality = "provinces";

var countriesMeta = {
    'au': {
        center: [133.775136, -25.274398],
        zoom: 3.2
    },
    'ca': {
        center: [-106.346771,  56.130366],
        zoom: 1.4
    },
    'es': {
        center: [-3.74922, 40.463667],
        zoom: 4.8
    },
    'uk': {
        center: [3.4360, 55.3781],
        zoom: 4.8
    },
    'us': {
        center: [-95.712891, 37.09024],
        zoom: 3
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    refresh();
});

function update(geojsonUrl) {

    if (map) map.remove();

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/sardanalokesh/cjdead20tee572rlca70kz35q',
        preserveDrawingBuffer: true
    });
    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    }));

    map.on('load', () => {
        showLoader();
    	if (!geojsonUrl) return;
        map.addSource('region-boundaries', {
            "type": "geojson",
            "data": geojsonUrl
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

        map.on("data", function(e) {
          if (e.sourceId === "region-boundaries")
            hideLoader();
        });

        let popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.on('mousemove', 'polygonLayer', event => {
            map.getCanvas().style.cursor = 'pointer';
            let html = '<table><tbody>';
            console.log(event.features);
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

        map.jumpTo({
            center: countriesMeta[selectedCountry].center,
            zoom: countriesMeta[selectedCountry].zoom
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

function changeCountry(e) {
    e.preventDefault();
    e.stopPropagation();
    let selectedElem = e.target;
    $("#countries").children().removeClass("active");
    $(e.target).toggleClass("active");
    selectedCountry = selectedElem.id;
    refresh();
}

function changeGranuality(e) {
    e.preventDefault();
    e.stopPropagation();
    let selectedElem = e.target;
    $("#granuality").children().removeClass("active");
    $(e.target).toggleClass("active");
    selectedGranuality = selectedElem.id;
    refresh();
}

function refresh() {
    if (!selectedCountry || !selectedGranuality) return;
    let url = "data/" + selectedCountry + "-" + selectedGranuality + ".geojson";
    update(url);
}






