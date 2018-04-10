const fs = require("fs");

var file1 = process.argv[2];
var file2 = process.argv[3];

file1 = fs.readFileSync(file1, "utf8");
file1 = JSON.parse(file1);

file2 = fs.readFileSync(file2, "utf8");
file2 = JSON.parse(file2);

var diff = file1.filter(d => file2.indexOf(d) === -1);

console.log(diff.length + " records of " + file1 + " are not there in " + file2);
