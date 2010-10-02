#! /usr/local/bin/node

var sys = require('sys');
var fs = require('fs');
var path = require('path');
var builder = require('./builder');

var manifestContentsForDevice = function(deviceName, files){
	var lines = ["CACHE MANIFEST","", "# " + new Date(),"", "CACHE:"];
	
	var addLines = function(name, newLines){
		lines.push("# " + name);
		lines = lines.concat(newLines);
		lines.push("");
	}
	addLines("Scripts", files.scripts);
	addLines("" + deviceName + " Stylesheets", files["" + deviceName + "Stylesheets"]);
	addLines("" + deviceName + " Graphics", files["" + deviceName + "Graphics"]);
	addLines ("Misc.", files.meta);

	lines.push("");
	lines.push("NETWORK:");
	lines.push("*");
	lines.push("");
	
	return lines.join("\n");
}

builder.loadFiles(process.cwd(), function(files){
	var devices = ["iPhone", "iPhone4"];
	for(var device in devices){
		var deviceName = devices[device];
		var filename = "WebSearch." + deviceName + ".manifest";
		sys.puts("Writing manifest file " + filename);
		fs.writeFile(filename, manifestContentsForDevice(deviceName, files));		
	}
});