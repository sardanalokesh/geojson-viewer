const fs = require("fs");

var file = "all/data/au-postal-codes.geojson";

var stateNames = ["New South Wales","Victoria","Queensland","South Australia","Western Australia","Tasmania","Northern Territory","Australian Capital Territory"];

var geojson = fs.readFileSync(file);
geojson = JSON.parse(geojson);

var uniqueStates = new Set();
geojson.features.forEach(feature => {
	feature.properties = {
		postal_code: feature.properties["POA_2006"],
		state: stateNames[parseInt(feature.properties["STATE_2006"]) - 1]
	};
	if (feature.properties.postal_code == "6798")
		feature.properties.state = "Christmas Island";
	if (feature.properties.postal_code == "6799")
		feature.properties.state = "Cocos (Keelings) Islands";
	uniqueStates.add(feature.properties.state);
		
});

var outputFile = file.slice(0,-8) + "1.geojson";

fs.writeFile(outputFile, JSON.stringify(geojson), "utf8", (err) => {
	if (err) throw err;
	console.log(Array.from(uniqueStates));
	console.log("done");
});