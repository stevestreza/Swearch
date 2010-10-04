#! /usr/local/bin/node

var sys = require('sys');
var fs = require('fs');
var path = require('path');
var builder = require('./builder');

builder.loadFiles(process.cwd(), function(files){	
	var lines = ["CACHE MANIFEST","", "# " + new Date(),"", "CACHE:"];
	
	var addLines = function(name, newLines){
		lines.push("# " + name);
		lines = lines.concat(newLines);
		lines.push("");
	}
	addLines("Scripts", files.scripts);
	addLines("Stylesheets", files.stylesheets);
	addLines("iPhone Graphics", files.iPhoneGraphics);
	addLines("iPhone 4 Graphics", files.iPhone4Graphics);
	addLines ("Misc.", files.meta);

	lines.push("");
	lines.push("NETWORK:");
	lines.push("*");
	lines.push("");
	
	fs.writeFile("WebSearch.manifest", lines.join("\n"));
});
