(function($){

if(!$.PageView){
	$.PageView = {};
}

$.PageView.Flickr = {
	appear: function(div){
		$.WSLog("SUP NEW YORK");
		$.get("flickr.rss",
		function(data, textStatus, httpRequest){
			$.WSLog("We gots us some data! " + data);
		}, "xml");
	},
	disappear: function(div){
		
	}
}
	
})(jQuery);