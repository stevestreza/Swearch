(function($){
	
var PAGE_WIDTH = 320;
	
$.fn.PageView = function(pages){
	return this.each(function(){
		var self = $(this);
		this.currentPageIndex = 0;
		this.pages = [];
		var stack = [];

		var lastOffset = 0;
		
		var generatePage = function(idx){
			var pageInfo = pages[idx];
			var page = $(document.createElement("div"));
 			page.addClass("page");
 			page.attr("id",pageInfo.id);
 			if(pageInfo.contents){
 				page.html(pageInfo.contents);
 			}			
 			self.append(page);
 		
 			pageInfo.page = page;

			if(pageInfo.setup){
				pageInfo.setup(page[0]);
			}
		}
		
		var changePage = function(page, animated, bounceFactor){
			if(!page || page < 0) page = 0;
			if(page >= self[0].pages.length) page = self[0].pages.length - 1;
			animated = ((animated == false) ? false : true);
			if(!bounceFactor || (bounceFactor > -1 && bounceFactor < 1)) bounceFactor = undefined;
			
			if(self[0].currentPageIndex != undefined){
				var oldPage = pages[self[0].currentPageIndex];
				if(oldPage.disappear && !(page == self[0].currentPageIndex)){
					oldPage.disappear(oldPage.page);
				}
			}
			
			self[0].currentPageIndex = page;
			
			if(page != undefined){
				var newPage = pages[page];
				if(!newPage.page){
					generatePage(page);
				}
				if(newPage.appear){
					newPage.appear(newPage.page);
				}

				var leftOffset = (0-(page * PAGE_WIDTH));
				var leftSnapOffset = Math.round(leftOffset - (bounceFactor / PAGE_WIDTH) * 3.5);
				
				var finish = {
					"-webkit-transform" : "translate3D(" + leftOffset + "px, 0px, 0px)"
				};
				var options = finish;

				var finishAnimatingPage = function(){
					$.WSLog.ClearStack();
					self.removeClass("animating");
					self.removeClass("animatingFast");
					self.removeClass("animatingSnapBack");
					self.css({"-webkit-transition-duration": "inherit"});
					lastOffset = leftOffset;
				};

				if(animated){					
					if(bounceFactor){
						var slowdown = Math.floor(Math.abs(bounceFactor / 40.));
						var firstStageSpeed  = 250 - slowdown;
						var secondStageSpeed = 150 + slowdown;
						
						self.addClass("animatingFast").css({
							"-webkit-transition-duration": "" + firstStageSpeed + "ms"
						});
						options = {
							"-webkit-transform" : "translate3D(" + leftSnapOffset + "px, 0px, 0px)"
						};
					}else{
						self.addClass("animating");
					}
					
					self.css(options);
					
					if(bounceFactor){
						setTimeout(function(){
							self.removeClass("animatingFast");
							self.addClass("animatingSnapBack").css({
								"-webkit-transition-duration": "" + secondStageSpeed + "ms"
							});
							self.css(finish);
							setTimeout(finishAnimatingPage, 175);
						},175);
					}
					setTimeout(finishAnimatingPage, 400);
				}else{
					self.css(options);
					finishAnimatingPage();
				}
				
				$.WSConfig.set("PageView.Page", ("" + page));
				return leftOffset;
			}
			return 0;
		}
		
		for(var idx=0; idx<pages.length;idx++){
			var pageInfo = pages[idx];
			this.pages[idx] = pageInfo;
			generatePage(idx);
		}
		
		self.css({width: PAGE_WIDTH * pages.length});
		
//		$.WSLog("Binding touch events");
		this.addEventListener("touchstart", function(event){
			self.removeClass("animating");
			
			var touch = event.touches[0];
			var startX = touch.pageX;
			var startOffset = lastOffset; //(parseInt(self.css("left"), 10));
			$.WSLog("" + startX + " " + startOffset)
			
			var tracker = new WSVelocityTracker();
			var addPoint = function(x,y){
				tracker.addPoint(x,y, new Date().getTime())
			}
			
			var didPan = false;
			var touchMove = function(event){
				didPan = true;
				var touch = event.touches[0];
				var pan = (touch.pageX % PAGE_WIDTH);
				var offset = (startX - pan);

				var leftOffset = startOffset - offset;
				if(leftOffset > 0){
					leftOffset = leftOffset / 2.;
				}else if(leftOffset < 0-(PAGE_WIDTH * (pages.length - 1))){
					leftOffset += (offset / 2.);
				}
				
				$.WSLog("Setting offset to " + leftOffset);
				self.css({
					"-webkit-transform": "translate3D(" + leftOffset + "px, 0px, 0px)"
				});

				addPoint(touch.pageX, touch.pageY);
			}
			var touchEnd = function(endEvent){
				if(didPan){
					var distance = startX - touch.pageX;
					var neededDistance = PAGE_WIDTH / 2.;
					
					var velocity = 0 - tracker.computeCurrentVelocity(1000).x;
					var neededVelocity = PAGE_WIDTH;
					var bounceVelocity = PAGE_WIDTH * 5.;
					
//					$.WSLog("Ended: velocity of " + Math.floor(velocity) + " distance " + Math.floor(distance));
					
					var bounces = undefined;
					
					var page = self[0].currentPageIndex;
					if((velocity > bounceVelocity) || ((0-velocity) > bounceVelocity)){
						page = page + (velocity > 0 ? 1 : -1);
						bounces = velocity;
					}else if((velocity > neededVelocity) || ((0-velocity) > neededVelocity)){
						page = page + (velocity > 0 ? 1 : -1);
					}else if((distance > neededDistance) || ((0-distance) > neededDistance)){
						page = page + (distance > 0 ? 1 : -1);
					}
					
					lastOffset = changePage( page, true, bounces)
				}
				
				this.removeEventListener("touchmove",touchMove);
				this.removeEventListener("touchend",touchEnd);
				
			}
			this.addEventListener("touchmove", touchMove);
			this.addEventListener("touchend", touchEnd);
		});
		
		var nextPage = function(){
			var index = 0;
			for(index; index < pages.length; index++){
				if(!pages[index].page){
					generatePage(index);
				}
			}
			$.WSLog.ClearStack();
			changePage(savedPage,false);
		};
		
		setTimeout(nextPage, 100);
		
		var savedPage = 0;
		try{
			savedPage = $.WSConfig.get("PageView.Page");
			savedPage = parseInt(savedPage, 10);
		}catch(e){
		}
	});
}
})(jQuery);