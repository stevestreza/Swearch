#! /usr/local/bin/node

var sys = require('sys');
var fs = require('fs');
var path = require('path');
var builder = require('./builder');

var manifestContentsForDevice = function(deviceNames, files){
	var lines = ["CACHE MANIFEST","", "# " + new Date(),"", "CACHE:"];
	
	var addLines = function(name, newLines){
		lines.push("# " + name);
		lines = lines.concat(newLines);
		lines.push("");
	}

	for(var deviceKey in deviceNames){
		var deviceName = deviceNames[deviceKey];
		addLines("" + deviceName + " Stylesheets", files["" + deviceName + "Stylesheets"]);
		addLines("" + deviceName + " Graphics", files["" + deviceName + "Graphics"]);
	}
	addLines("Scripts", files.scripts);
	addLines ("Misc.", files.meta);

	lines.push("");
	return lines.join("\n");
}

builder.loadFiles(process.cwd(), function(files){
	var devices = ["iPhone", "iPhone4"];
	for(var device in devices){
		var deviceName = devices[device];
		var filename = "WebSearch." + deviceName + ".manifest";
		sys.puts("Writing manifest file " + filename);
		fs.writeFile(filename, manifestContentsForDevice([deviceName], files));		
	}
	sys.puts("Writing manifest file WebSearch.manifest");
	fs.writeFile("WebSearch.manifest", manifestContentsForDevice(devices, files));		
});
