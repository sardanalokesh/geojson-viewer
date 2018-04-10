const fs = require("fs");

var file = "all/data/us-postal-codes.geojson";

var geojson = fs.readFileSync(file);
geojson = JSON.parse(geojson);

var uniqueStates = new Set();
geojson.features.forEach(feature => {
	feature.properties = {
		postal_code: feature.properties["zip"],
		state: feature.properties["state"]
	};
	uniqueStates.add(feature.properties.state);
		
});

var outputFile = file.slice(0,-8) + "1.geojson";

fs.writeFile(outputFile, JSON.stringify(geojson), "utf8", (err) => {
	if (err) throw err;
	console.log(Array.from(uniqueStates));
	console.log("done");
});