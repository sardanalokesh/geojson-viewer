const fs = require('fs');

var propertyName = process.argv[2];
var geojsonFile = process.argv[3];

console.log("reading file " + geojsonFile);
geojsonFile = fs.readFileSync(geojsonFile, "utf8");
var geojson = JSON.parse(geojsonFile);


var output = [];

geojson.features.forEach(feature => {
	output.push(feature.properties[propertyName]);
});

var outputFile = geojsonFile.slice(0,-8) + ".json";
console.log("writing file " + outputFile);
fs.writeFile(outputFile, JSON.stringify(output), "utf8", (error) => {
	if(!error) throw error;
	console.log("done");
});