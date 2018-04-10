const fs = require("fs");

var file = "all/data/es-postal-codes.geojson";

var geojson = fs.readFileSync(file);
geojson = JSON.parse(geojson);

geojson.features.forEach(feature => {
	feature.properties = {
		postal_code: feature.properties["COD_POSTAL"]
	};
		
});

var outputFile = file.slice(0,-8) + "1.geojson";

fs.writeFile(outputFile, JSON.stringify(geojson), "utf8", (err) => {
	if (err) throw err;
	console.log("done");
});