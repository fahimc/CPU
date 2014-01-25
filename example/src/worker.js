(function() {

	var CPUWorker = {
		_time:null,
		_high:700,
		_medium:600,
		_low:500,
		init:function(){
			var _this = this;
			self.addEventListener('message', function(e){_this.onMessage(e);});
			this._time=new Date();
			setInterval(function(){
				_this.check();
			},500);
		},
		check:function(){
			var now = new Date();
			var elapsed = now-this._time;
			var message = "none";
			if(elapsed>=this._high)
			{
				message="high";
				
			}else if(elapsed>=this._medium)
			{
				message="medium";
			}else if(elapsed>this._low)
			{
				message="low";
			}
			
			self.postMessage({type:message,elapsed:elapsed});
		},
		onMessage : function(e) {
			this._time= e.data;
			
		}
	};

	CPUWorker.init();
})();
