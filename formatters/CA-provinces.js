const fs = require("fs");

var file = "all/data/ca-provinces.geojson";

var geojson = fs.readFileSync(file);
geojson = JSON.parse(geojson);

var nullState = [];

var uniqueStates = new Set();
geojson.features.forEach(feature => {
	if (!feature.properties["NAME"])
		nullState.push(JSON.stringify(feature.properties));
	feature.properties = {
		state: feature.properties["NAME"]
	};
	uniqueStates.add(feature.properties.state);
		
});

var outputFile = file.slice(0,-8) + "1.geojson";

fs.writeFile(outputFile, JSON.stringify(geojson), "utf8", (err) => {
	if (err) throw err;
	console.log(Array.from(uniqueStates));
	console.log(nullState);
	console.log("done");
});