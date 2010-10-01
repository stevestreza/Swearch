var debug = false;

jQuery(function() {
  var cache = [];
  // Arguments are image paths relative to the current page.
  $.preLoadImages = function() {
    var args_len = arguments.length;
    for (var i = args_len; i--;) {
      var cacheImage = document.createElement('img');
      cacheImage.src = arguments[i];
      cache.push(cacheImage);
    }
  }
	$.WSLog = function(){
		return;
		var msg = [];
		$.fn.each.apply(arguments, [function(){
			var obj = this;
			msg.push(obj);
		}]);
		$.WSLog.Stack.splice(0,0,msg.join(""));

		$("#debug").html($.WSLog.Stack.join("<br />"));
	}
	$.WSLog.Stack = [];
	$.WSLog.ClearStack = function(){ $.WSLog.Stack = []; }
	
	$.WSConfig = {
		observers: {},
		addObserver: function(key, func){
			var observers = $.WSConfig.observers[key];
			if(!observers){
				observers = [];
				$.WSConfig.observers[key] = observers;
			}
			observers.push(func);
		},
		set: function(key, value){
			var oldValue = $.WSConfig.get(key);
			localStorage.setItem(key, value);
			
			var observers = $.WSConfig.observers[key];
			if(observers){
				for(var i=0; i<observers.length; i++){
					observers[i](key, value, oldValue);
				}
			}
		},
		get: function(key){
			return localStorage.getItem(key);
		}
	}
	
	if(!$.WSConfig.get("WSOpenInSafari")) $.WSConfig.set("WSOpenInSafari", false);
	
	var displayHomeScreenHUDIfNeeded = function(){
		var alreadyHidden = $.WSConfig.get("HomeScreenHUDHidden");
		if ((!window.navigator.standalone && alreadyHidden != "true")) {
			var hud = $("#home-screen-hud");
			hud.css({
				top: 240,
				opacity: 0
			}).animateWithCSS({
				top: 210,
				opacity: 1
			}, 1000).click(function(event){
				$.WSConfig.set("HomeScreenHUDHidden",true);
				hud.animateWithCSS({
					top: 180,
					opacity: 0
				});
				setTimeout(function(){
					hud.css({
						display: "none"
					});
				}, 500);
			});
		}
	}
	
	var openURL = function(url){
		if($.WSConfig.get("WSOpenInSafari") == true){
			window.location.href = url;
		}else{
			window.location = url;
		}
	}
	
	var pages = [
		{ // Google
			id: "searchGoogle",
			contents: '<div id="googleLogo"></div>',
			search: function(term){
				term = term.replace(" ","+");
				openURL("http://www.google.com/search?q="+term+"&ie=UTF-8&oe=UTF-8&hl=en&client=safari");
			}
		}, { // Twitter
			id: "searchTwitter",
			contents: '<div id="twitterLogo"></div><div id="twitterBackground"></div>',
			search:function(term){
				term = term.replace(" ", "+");
				openURL("http://mobile.twitter.com/searches?q=" + term);
			},
			appear: $.PageView.Twitter.appear,
			disappear: $.PageView.Twitter.disappear,
			setup: $.PageView.Twitter.setup
		},
		{ // Wikipedia
			id: "searchWikipedia",
			search: function(term){
				term = term.replace(" ","+");
				openURL("http://en.wikipedia.org/w/index.php?title=Special%3ASearch&search=" + term);
			}
		}, { // Flickr
 			id: "searchFlickr",
 			contents: '<div id="flickrLogo"></div>',
 			search:function(term){
 				term = term.replace(" ", "+");
 				openURL("http://m.flickr.com/#/search/advanced/_QM_q_IS_" + term);
 			}
 //			appear: $.PageView.Flickr.appear,
 //			disappear: $.PageView.Flickr.disappear

/*		},{ // Bing
			id: "searchBing",
			contents: '<div id="bingLogo"></div><div id="bingBackground"></div>',
			search: function(term){
				term = term.replace(" ", "+");
				openURL("http://m.bing.com/search/search.aspx?q="+term+"&d=&dl=&a=results&a2=modifylocation&MID=10006&asq=&asems=");
			},
			appear: $.PageView.Bing.appear,
			disappear: $.PageView.Bing.disappear,
			setup: $.PageView.Bing.setup
*/		}
	];
	
//	$.WSLog ("pages.twitter.appear = " + pages[pages.length-1].appear);
		
	var searchList = $("#searchList");
	$.getScript("WSPageView.js", function(){
		searchList.PageView(pages);

	   var hideTooltip = function(){
	   	$("#tooltip").animateWithCSS({
	   		top: -50
	   	});
		
		var signature = $("#signature");
		var height = 60;
		var top = parseInt(signature.css("top"), 10);
//		alert("Moving from " + top + " to " + (height + top) + " ( " + height + ")");
		signature.animateWithCSS({
			top: (height+top)
		});
	   	searchList[0].removeEventListener("touchstart",hideTooltip);
	   }
	   searchList[0].addEventListener("touchstart", hideTooltip);


	});
 	setTimeout(function(){
		window.scrollTo(0,1);
		displayHomeScreenHUDIfNeeded();
		$("#tooltip").animateWithCSS({
			top:0
		});
	}, 100)

	var searchField = $("#searchField");
	searchField.focus();
	
	var performSearch = function(){
		searchField.blur();
		var searchTerm = encodeURIComponent(searchField[0].value);
		var page = pages[searchList[0].currentPageIndex];
		page.search(searchTerm);
		return false;
	};

	$("#searchButton").click(performSearch);
	$("#searchForm").bind("submit", performSearch);
	
	$.getScript("WSSwitch.js", function(){
		var settingsBackground = $("#settingsBackground");
		var bgSwitch = null;

		var settingsPopup = $(document.createElement("div"));
		settingsPopup.attr({id: "settingsPopup"});
		settingsBackground.append(settingsPopup);

		if(!bgSwitch){
			bgSwitch = settingsBackground.find("#openInSafari");
			bgSwitch.Switch($.WSConfig.get("WSOpenInSafari"), function(state){
				state = (state == true ? 1 : 0);
				$.WSConfig.set("WSOpenInSafari",state);
				$.WSLog("Setting state to " + state);
			});
		}
		$("#settingsButton").click(function(){
			settingsBackground.css({ display: "block", opacity: 0}).animateWithCSS({opacity:1.0}).click(function(){
				settingsBackground.animateWithCSS({opacity: 0},function(){
					settingsBackground.css({display: "none"});
				});
			});
		});
	});
	
	var cacheIndicator = $("#cacheIndicator");
	var appCache = window.applicationCache;
	var updateCacheIndicator = function(ev){
		switch(appCache.status){
			case 0: // uncached
				cacheIndicator.css({
					backgroundColor: "red"
				});
				break;
			case 1: // idle
				cacheIndicator.css({
					backgroundColor: "green"
				});
				break;
			case 2: // checking
				cacheIndicator.css({
					backgroundColor: "yellow"
				});
				break;
			case 3: // downloading
				cacheIndicator.css({
					backgroundColor: "orange"
				});
				break;
			case 4: // updateready
				cacheIndicator.css({
					backgroundColor: "white"
				});
				break;
		}
	}
	appCache.addEventListener('cached', updateCacheIndicator, false);
	appCache.addEventListener('checking', updateCacheIndicator, false);
	appCache.addEventListener('downloading', updateCacheIndicator, false);
	appCache.addEventListener('noupdate', updateCacheIndicator, false);
	appCache.addEventListener('progress', updateCacheIndicator, false);
	appCache.addEventListener('updateready', updateCacheIndicator, false);
	appCache.addEventListener('error', function(err){
		var dict = {};
		for(var key in err){
			dict[key] = err[key];
		}
		$.WSLog(JSON.stringify(dict));
	}, false);
	updateCacheIndicator();
//	$.WSLog("Search THIS ", searchField[0]);\n
	
	if(window.navigator.standalone){
		$("#body").addClass("fullscreen");
	}
	
	document.body.ontouchmove = function(event){
		if(!debug){
			event.preventDefault();
		}
	};
	
	setInterval(function(e){
		if(window.scrollY > 1){
			window.scrollTo(0,1);
		}
	}, 500);
});
