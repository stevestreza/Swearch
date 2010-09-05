(function($){

if(!$.PageView){
	$.PageView = {};
}

var StringForNode = function(node, tabs){
	if(!tabs) tabs = "";
	
	var strings = [];
	var jNode = $(node);
	var children = jNode[0].childNodes;

	strings.push(tabs + "<div id='" + jNode.attr("id") + "' class='" + jNode.attr("class") + "'>" + (children.length > 0 ? "" : "</div>"));
	
	for(var i=0; i<children.length; i++){
		strings.push(StringForNode(children[i], tabs + "&nbsp; "));
	}
	
	if(children.length>0){
		strings.push(tabs + "</div>")
	}
	return strings.join("<br/>");
}

$.PageView.Bing = {
	pageView: null,
	setup: function(div){
		var self = $.PageView.Bing;
		self.pages = [];

		var backgroundProperty = ($(div).css("backgroundImage"));
		var backgroundURL = backgroundProperty.replace(/url\((.*)\)$/, "$1");
		
		$.PageView.Bing.pageView = $(div).find("#bingBackground");

		$.get("bing.xml",
		function(data, textStatus, httpRequest){
			var images = $(data).find("image").each(function(){
				url = $(this).find("url").text();
				url = "http://bing.com" + url;
				
				self.pages.push({src: url});
			});

			$.PageView.Bing.pageView.crossSlide({
			  		sleep: 5,
			  		fade: 2
				}, (backgroundURL ? [{src:backgroundURL}].concat(self.pages) : self.pages));

			$.PageView.Bing.pageView.crossSlidePause();
		}, "xml");		
		$.WSConfig.addObserver("WSAnimateBackgrounds", function(key, value){
			$(self.clouds).each(function(){
				$.PageView.Bing.pageView["crossSlide" + (value?"Resume":"Pause")]();
			});
		});
	},
	appear: function(div){
		if($.WSConfig.get("WSAnimateBackgrounds")){
			$.PageView.Bing.pageView.crossSlideResume();
		}
	},
	disappear: function(div){
		$.PageView.Bing.pageView.crossSlidePause();
	}
}
	
})(jQuery);