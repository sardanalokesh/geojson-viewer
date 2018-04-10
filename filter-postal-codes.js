const fs = require('fs');

var file = process.argv["2"];

console.log("processing file " + file);
var usData = fs.readFileSync(file, "utf8");
usData = usData.split("\n");
usData = usData.map(d => {let ps = d.split("|"); return ps[0].split(":")[1];});

var outputFile = file.slice(0,-4) + ".json";
console.log("writing file " + outputFile);
fs.writeFile(outputFile, JSON.stringify(usData), "utf8", (err) => {
	if(err) throw err;
	console.log("done");
});