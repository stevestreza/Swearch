(function(window){
		var NUM_PAST = 10;
		var LONGEST_PAST_TIME = 50;
		var localLOGV = undefined;
       
		window.WSVelocityTracker = function() {
//			this.mPastX = [];
//			this.mPastY = [];
//			this.mPastTime = [];
			this.mPast = [];

			this.mYVelocity = 0;
			this.mXVelocity = 0;
		}
       
		/**
		  * Reset the velocity tracker back to its initial state.
		  */
		WSVelocityTracker.prototype.clear = function() {
			this.mPastTime[0] = 0;
		}
       
		WSVelocityTracker.prototype.addPoint = function(x, y, time) {
			var drop = -1;
			var i = 0;
			if (localLOGV) Log.v(TAG, "Adding past y=" + y + " time=" + time);
			for (i=0; i<NUM_PAST; i++) {
			    if (this.mPast[i] == undefined) {
			        break;
			    } else if (this.mPast[i].time < time-LONGEST_PAST_TIME) {
			        if (localLOGV) Log.v(TAG, "Dropping past too old at "
			                + i + " time=" + this.mPast[i].time);
			        drop = i;
			    }
			}
			if (localLOGV) Log.v(TAG, "Add index: " + i);
			if (i == NUM_PAST && drop < 0) {
			    drop = 0;
			}
			if (drop == i) drop--;
			this.mPast.push({
				x: x,
				y: y,
				time: time
			})
		}
       
		/**
		  * Compute the current velocity based on the points that have been
		  * collected.  Only call this when you actually want to retrieve velocity
		  * information, as it is relatively expensive.  You can then retrieve
		  * the velocity with {@link #getXVelocity()} and
		  * {@link #getYVelocity()}.
		  * 
		  * @param units The units you would like the velocity in.  A value of 1
		  * provides pixels per millisecond, 1000 provides pixels per second, etc.
		  */
		WSVelocityTracker.prototype.computeCurrentVelocity = function(units) {
			// Kind-of stupid.
			var oldestX = this.mPast[0].x;
			var oldestY = this.mPast[0].y;
			var oldestTime = this.mPast[0].time;
			var accumX = 0;
			var accumY = 0;
			var N=0;
			while (N < NUM_PAST && N < this.mPast.length - 1) {
			    if (this.mPast[this.mPast.length - 1 - N].time == 0) {
//					alert("Done " + N + " " + this.mPast[this.mPast.length - 1 - N]);
			        break;
			    }
			    N++;
			}
			// Skip the last received event, since it is probably pretty noisy.
			if (N > 3) N--;
       
			for (var i=1; i < N; i++) {
				var past = this.mPast[this.mPast.length - 1 - N + i];
			    var dur = (past.time - oldestTime);
			    if (dur > LONGEST_PAST_TIME){
//					alert("this.mPast[" + (this.mPast.length - 1 - N + i) + "] has dur of " + dur + ", less than " + LONGEST_PAST_TIME);
					continue;
				}

			    var dist = past.x - oldestX;
			    var vel = (dist/dur) * units;   // pixels/frame.
				
//				if(i == 1){
//					alert("i = " + i + ": vel = (" + dist + "/" + dur + ") * " + units + " = " + vel);
//				}
			    if (accumX == 0) accumX = vel;
			    else accumX = (accumX + vel) * .5;
       
			    dist = past.y - oldestY;
			    vel = (dist/dur) * units;   // pixels/frame.
			    if (accumY == 0) accumY = vel;
			    else accumY = (accumY + vel) * .5;
			
			}
			this.mXVelocity = accumX;
			this.mYVelocity = accumY;
       
//			if (localLOGV) Log.v(TAG, "Y velocity=" + this.mYVelocity +" X velocity="
//			        + this.mXVelocity + " N=" + N);
			
			return {x: this.mXVelocity, y: this.mYVelocity};
		}
       
		/**
		  * Retrieve the last computed X velocity.  You must first call
		  * {@link #computeCurrentVelocity(int)} before calling this function.
		  * 
		  * @return The previously computed X velocity.
		  */
		WSVelocityTracker.prototype.getXVelocity = function() {
			return this.mXVelocity;
		}
       
		/**
		  * Retrieve the last computed Y velocity.  You must first call
		  * {@link #computeCurrentVelocity(int)} before calling this function.
		  * 
		  * @return The previously computed Y velocity.
		  */
		WSVelocityTracker.prototype.getYVelocity = function() {
			return this.mYVelocity;
		}
})(window);
