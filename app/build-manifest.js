#! /usr/local/bin/node

var sys = require('sys');
var fs = require('fs');
var path = require('path');

var files = [];

var scripts = [];
var stylesheets = [];
var iPhoneGraphics = [];
var iPhone4Graphics = [];
var meta = [];

var processPath = function(thePath){
	if(thePath == path.basename(process.argv[1])){
		// disregard this
		sys.puts("Disregarding " + thePath);
	}else if(/.*\@2x\.(jpg|png)/.test(thePath)){
		iPhone4Graphics.push(thePath);
	}else if(/.*\.(jpg|png)/.test(thePath)){
		iPhoneGraphics.push(thePath);
	}else if(/.*\.css/.test(thePath)){
		stylesheets.push(thePath);
	}else if(/.*\.js/.test(thePath)){
		scripts.push(thePath);
	}else if(/.*\.html/.test(thePath) && !(/.*-dev\.html/.test(thePath))){
		meta.push(thePath);
//	}else if(/.*\.xml/.test(thePath) || /.*\.rss/.test(thePath)) {
//		meta.push(thePath);
	}else{
		sys.puts("Cannot process " + thePath);
	}
}

fs.readdir(process.cwd(), function(err,allFiles){
	for(var file in allFiles){
		processPath(allFiles[file]);
	}
	
	var lines = ["CACHE MANIFEST","", "# " + new Date(),"", "CACHE:"];
	
	var addLines = function(name, newLines){
		lines.push("# " + name);
		lines = lines.concat(newLines);
		lines.push("");
	}
	addLines("Scripts", scripts);
	addLines("Stylesheets", stylesheets);
	addLines("iPhone Graphics", iPhoneGraphics);
	addLines("iPhone 4 Graphics", iPhone4Graphics);
	addLines ("Misc.", meta);
	
	fs.writeFile("WebSearch.manifest", lines.join("\n"));
})
