(function($){
	
$.fn.backgroundURL = function(){
	return this.each(function(){
		return $(this).css("background-image").replace(/url\((.*)\)/, "$1");
	})
}

$.fn.Switch = function(initialState, toggleFunction){
	return this.each(function(){
		var self = $(this);
		self.state = initialState;
		
		self.handle = $("<div class='switchHandle'></div>");
		self.append(self.handle);
		
		var bgImage = self.backgroundURL();
		$.preLoadImages(self.backgroundURL(), self.handle.backgroundURL());
		
		var min = -1;
		var max = -1;
		
		var setState = function(state){
			$.WSLog("State to state: " + self.state + " " + state);
			if(state != self.state){
				self.state = state;
				toggleFunction(self.state);
			}
			
			self.handle.animateWithCSS({
				left: (self.state ? max : min)
			}, 200);
		}
		
//		self.handle.click(function(event){
//			setState(!self.state);
//			event.preventDefault();
//		});
		
		self.handle[0].addEventListener("touchstart", function(event){
			window.title = "touchstart";
	   		var touch = event.touches[0];
	   		var startX = touch.pageX - self.offset().left;
	   		var startOffset = (parseInt(self.handle.css("left"), 10));
			$.WSLog("Starting at "+ startX +", offset of " + startOffset);

			if(min == -1 && max == -1){
				min = 1;
				max = self.width() - self.handle.width() - 1;

				$.WSLog("Range of " + min + " to " + max + " (" + self.width() +" - " + self.handle.width() + " - 1)");
			}
			
			var didMove = false;
			var touchMove = function(event){
				didMove = true;
				window.title = "touchmove";
   				var pan = (touch.pageX - self.offset().left);
   				var offset = (pan - startX);

   				var leftOffset = offset + startOffset;
   				if(leftOffset < min){
					leftOffset = min;
   				}else if(leftOffset > max){
					leftOffset = max;
				}
				
				$.WSLog("Panned to " + pan + " for an offset of " + offset + " = " + (offset-startOffset) + "->" + leftOffset);

   				self.handle.css({
   					left: leftOffset
   				})

				event.preventDefault();
			};
			
			var touchEnd = function(event){
				if(didMove){
					window.title = "touchend";
					var distance = touch.pageX-self.offset().left - startX;
					var neededDistance = (max-min) / 2.;
					
					$.WSLog("Got a distance of " + distance + ", needing " + neededDistance);
				
					setState((Math.abs(distance) > neededDistance) ? self.state ? 0 : 1 : self.state ? 1 : 0);
				}else{
					setState(1-self.state);
				}

				self.handle[0].removeEventListener("touchmove",touchMove);
				self.handle[0].removeEventListener("touchend",touchEnd);
				
				event.preventDefault();
			};
			
			self.handle[0].addEventListener("touchmove", touchMove);
			self.handle[0].addEventListener("touchend", touchEnd);

			event.preventDefault();
		});
		setState(initialState);
	});
};

})(jQuery);
