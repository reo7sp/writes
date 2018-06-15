var watch = require("node-watch");
var build = require("./build-lib")

build();

watch(["ejs", "posts", "static"], { recursive: true }, function (evt, name) {
	console.log("Rebuild")
	build();
});