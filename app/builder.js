var sys = require('sys');
var fs = require('fs');
var path = require('path');

var loadFiles = exports.loadFiles = function(loadPath, cb){
	var files = {
		scripts: [],
		iPhoneStylesheets: [],
		iPhone4Stylesheets: [],
		iPhoneGraphics: [],
		iPhone4Graphics: [],
		meta: []
	}
	
	var andOp = function(fn1, fn2){
		return function(val){
			return (fn1(val) && fn2(val));
		};
	}
	var notOp = function(fn){
		return function(val){
			return !fn(val);
		};
	}
	
	var matcherForRegex = function(regex){
		return function(thePath){
			return regex.test(thePath);
		};
	}
	
	var matches = {
		ignores: [
			function(thePath){
				return (thePath == path.basename(process.argv[1]));
			},
			matcherForRegex(/builder\.js$/),
			matcherForRegex(/test-cache\.html$/),
			matcherForRegex(/index-dev\.html$/)
		],
		iPhone4Graphics: [
			matcherForRegex(/.*\@2x\.(jpg|png)$/),
			matcherForRegex(/splashimage\.png$/)
		],
		iPhoneGraphics: [
			andOp(matcherForRegex(/.+\.(jpg|png)$/), notOp(matcherForRegex(/.*\@2x\.(jpg|png)$/)))
		],
		iPhoneStylesheets: [
			matcherForRegex(/.*\.iPhone\.css/),
			andOp(matcherForRegex(/.*\.css$/), notOp(matcherForRegex(/.*\.iPhone4\.css/)))
		],
		iPhone4Stylesheets: [
			matcherForRegex(/.*\.iPhone4\.css$/),
			andOp(matcherForRegex(/.*\.css$/), notOp(matcherForRegex(/.*\.iPhone\.css/)))
		],
		scripts: [
			matcherForRegex(/.*\.js$/)
		],
		meta: [
			matcherForRegex(/.*\.html$/)
		]
	};
	
	var isPathIgnored = function(thePath){
		for(var idx in matches.ignores){
			var ignoreTest = matches.ignores[idx];
			if(ignoreTest(thePath)){
				return true;
			}
		}
		
		return false;
	}
	
	var doesPathMatchFileType = function(thePath, filetype){
		var matchers = matches[filetype];
		for(var idx in matchers){
			var matchTest = matchers[idx];
			if(matchTest(thePath)){
				return true;
			}
		}
		return false;
	}

	var processPath = function(thePath){
		if(isPathIgnored(thePath)){
			sys.puts("Disregarding " + thePath);
			return;
		}

		for(var filetype in matches){
			if(filetype == "ignores") continue;
			if(doesPathMatchFileType(thePath, filetype)){
				files[filetype].push(thePath);
			}
		}
	}

	fs.readdir(loadPath, function(err,allFiles){
		for(var file in allFiles){
			processPath(allFiles[file]);
		}

		cb(files);
	});
}