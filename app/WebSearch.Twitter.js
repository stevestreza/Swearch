(function($){

//var $.WSLog = function(){};

$.randomBetween = function(min,max){
	if(!max){
		max = min;
		min = 0.;
	}
	return Math.floor(Math.random()*(max-min)) + min;
}

$.valueForWebkitTransform = function(transformValue){
	var contents = transformValue.replace(/[A-Za-z0-9]+\((.*)\)/g, "$1");
	var items = contents.split(/, ?/g);
	var results = [];
	$(items).each(function(){
		results.push(parseInt(this, 10));
	})
	
	return results;
}

// only animates left<->right
$.fn.animateWithSpeed = function(opts, speed, easing, callback){
	return this.each(function(){
		opts["-webkit-transform"] = "translate3D(" + (opts.left ? opts.left : 0) + "px, 0px, 0px)";
	
		var currentPosition = $.valueForWebkitTransform($(this).css("-webkit-transform"))[0];
	
		var delta = opts.left - currentPosition;
		var duration = Math.floor(delta / speed * 1000);
		
		opts["-webkit-transition-duration"] = "" + duration + "ms";
	
//		$.WSLog("Animating from " + currentPosition + " to " + opts["-webkit-transform"] + " - " + delta + "px in " + opts["-webkit-transition-duration"]);
		opts.left = undefined;
		
		$(this).css(opts);
		setTimeout(callback, duration);
	})
}

if(!$.PageView){
	$.PageView = {};
}

$.PageView.Twitter = {
	numberOfClouds: 9,
	pageView: null,
	animateCloud: function(animateDiv, animateDepth){
		var speedVariance = 6;
		var speed = (15 - (animateDepth * 10)) + $.randomBetween(0-speedVariance, speedVariance);
		if(speed < 4) speed = 4;
	   	animateDiv.animateWithSpeed({"left": 320}, speed, "linear", function(){
			var leftOffset = (0 - parseInt(animateDiv.css("width"), 10));
			$.WSLog("Resetting cloud to ", leftOffset);
	   		animateDiv.css({
				"-webkit-transition-duration": "0ms",
				"-webkit-transform": "translate3D(" + leftOffset + "px, 0px, 0px)"
	   		});
			setTimeout(function(){
				$.PageView.Twitter.animateCloud(animateDiv, animateDepth);
			}, 100);
		});
	},
	setup: function(div){
		var self = $.PageView.Twitter;
		var backgroundView = $(div).find("#twitterBackground");
		if(!self.clouds){
			self.generateClouds(backgroundView);
		}
		$(self.clouds).each(function(){
			$(this).pause();
		});
		
		$.WSConfig.addObserver("WSAnimateBackgrounds", function(key, value){
			$(self.clouds).each(function(){
				$(this)[value?"resume":"pause"]();
			});
		});
	},
	appear: function(div){
		var self = $.PageView.Twitter;
//			setTimeout(function(){
//				$(self.clouds).each(function(){
//					$(this).resume();
//				});
//			}, 500);
	},
	disappear: function(div){
		var self = $.PageView.Twitter;
		$(self.clouds).each(function(){
			$(this).pause();
		});
	},
	generateClouds: function(div){
		$.PageView.Twitter.clouds = [];
		
		var leftPositionForIndex = function(index, count){
			var start = -200;
			var end = 280;
			var variance = 20;
			
			var distance = end-start;
			var spacing = distance/count;
			
			var left = start + (spacing * index) + $.randomBetween(0-variance, variance);
			return left;
		}

		for(var i=0; i < $.PageView.Twitter.numberOfClouds; i++){
			var depth = i % 3;
			var variant = $.randomBetween(1,3);
			var cloudID = "cloud" + variant + (depth == 0 ? "" : "-" + depth);
//			$.WSLog("cloudID: " + cloudID + "@2x.png" + " at " + (100+(-25 * depth)) + "% speed/depth");
			
			var cloud = {};
			var cloudDiv = $("<div class='cloud " + cloudID + "'>");
			
			var cssOpts = {
				position: "absolute",
				"-webkit-transform": "translate3D(" + leftPositionForIndex(i, $.PageView.Twitter.numberOfClouds) + "px, 0px, 0px)",
				top: 200-(50 * depth) + $.randomBetween(-20,20),
				zIndex: 100 - (depth * 20)
//				"-webkit-transform": "scaleX(" + (($.randomBetween(0,1) * 2)-1) + ")"
			};
			cloudDiv.css(cssOpts);
			
			div.append(cloudDiv);
			$.PageView.Twitter.clouds.push(cloudDiv);
			
			$.PageView.Twitter.animateCloud(cloudDiv, depth);
		}
		
		div.children().each(function(){
			var position = $(this).position();
//			$.WSLog("Posish: " + position.top + "x" + position.left);
		})
	}
}
	
})(jQuery);