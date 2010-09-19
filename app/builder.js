var sys = require('sys');
var fs = require('fs');
var path = require('path');

var loadFiles = exports.loadFiles = function(loadPath, cb){
	var files = {
		scripts: [],
		stylesheets: [],
		iPhoneGraphics: [],
		iPhone4Graphics: [],
		meta: []
	}

	var processPath = function(thePath){
		if(thePath == path.basename(process.argv[1])){
			// disregard this
			sys.puts("Disregarding " + thePath);
		}else if(/.*\@2x\.(jpg|png)/.test(thePath)){
			files.iPhone4Graphics.push(thePath);
		}else if(/.*\.(jpg|png)/.test(thePath)){
			files.iPhoneGraphics.push(thePath);
		}else if(/.*\.css/.test(thePath)){
			files.stylesheets.push(thePath);
		}else if(/.*\.js/.test(thePath)){
			files.scripts.push(thePath);
		}else if(/.*\.html/.test(thePath) && !(/.*-dev\.html/.test(thePath))){
			files.meta.push(thePath);
	//	}else if(/.*\.xml/.test(thePath) || /.*\.rss/.test(thePath)) {
	//		files.meta.push(thePath);
		}else{
			sys.puts("Cannot process " + thePath);
		}
	}

	fs.readdir(loadPath, function(err,allFiles){
		for(var file in allFiles){
			processPath(allFiles[file]);
		}

		cb(files);
	});
}