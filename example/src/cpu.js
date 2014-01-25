var cpu = (function() {

	function cpu() {

	}


	cpu.prototype = {
		_collection : [],
		_current : null,
		_high : 700,
		_medium : 600,
		_low : 500,
		_exit : false,
		_elem : null,
		_resetTimer : null,
		_worker : null,
		_colors : {
			high : "#B02B2C",
			medium : "#D15600",
			low : "#73880A"
		},
		_heights : {
			high : "100%",
			medium : "50%",
			low : "25%"
		},
		_animateLow : function() {
			if(!this.elem)return;
			this.elem.firstChild.style.backgroundColor = this._colors.low;
			this.elem.firstChild.style.height = this._heights.low;
		},
		_animateMedium : function() {
			if(!this.elem)return;
			this.elem.firstChild.style.backgroundColor = this._colors.medium;
			this.elem.firstChild.style.height = this._heights.medium;
		},
		_animateHigh : function() {
			if(!this.elem)return;
			this.elem.firstChild.style.backgroundColor = this._colors.high;
			this.elem.firstChild.style.height = this._heights.high;
		},
		_animateDown : function() {
			if(!this.elem)return;
			this.elem.firstChild.style.backgroundColor = this._colors.low;
			this.elem.firstChild.style.height = "0";
		},
		_onMessage : function(e) {
			// console.log(e.data);

			switch(e.data.type) {
				case "high":
					this._exit = true;
					this._animateHigh();
					break;
				case "medium":
					this._exit = false;
					this._animateMedium();
					break;
				case "low":
					this._exit = false;
					this._animateLow();
					break;
				default:
					this._exit = false;
					this._animateDown();
					break;
			}
			this.reset();
			this._worker.postMessage(new Date());
		},
		_createDisplay:function(){
			this.elem = document.createElement('DIV');
			this.elem.style.width = "20px";
			this.elem.style.zIndex = "9999";
			this.elem.style.display = "block";
			this.elem.style.height = "30px";
			this.elem.style.padding = "0";
			this.elem.style.margin = "0";
			this.elem.style.position = "absolute";
			this.elem.style.right = "0";
			this.elem.style.top = "0";
			this.elem.style.border = "1px solid #e4e4e4";
			this.elem.style.backgroundColor = "#333";

			var child = document.createElement('DIV');
			child.style.width = "100%";

			child.style.display = "block";
			child.style.height = "0";
			child.style.position = "absolute";
			child.style.bottom = "0";
			child.style.backgroundColor = "";
			child.style.transition = "all 0.5s";
			child.style.webkitTransition = "all 0.5s";

			this.elem.appendChild(child);
			document.body.appendChild(this.elem);
		},
		log : false,
		debug : function() {
			if(!document.body){
				var _this = this;
				window.addEventListener('load',function(){_this._createDisplay();});
				return;
			}
			
			this._createDisplay();
		},
		global : function() {
			if (this._worker)
				return;
			var _this = this;
			
			//create worker
			var blob = new Blob([this._workerMethod]);
			var blobURL = window.URL.createObjectURL(blob);
			
			this._worker = new Worker(blobURL);
			this._worker.addEventListener('message', function(e) {
				_this._onMessage(e);
			});
			this._worker.postMessage(new Date());

		},
		start : function(name) {
			this._exit = false;
			this._collection[name] = {
				startTime : new Date()
			};
			this._current = name;
		},
		stop : function() {

		},
		exit : function(manual) {
			if (manual || this._exit) {
				if (this._exit && this.log)
					console.log("High CPU usage on task '" + this._current + "' exited");
				this._exit = false;

				return true;
			}
			return false;
		},
		check : function() {
			var now = new Date();
			if (now - this._collection[this._current].startTime > this._high) {
				this._exit = true;
				this._animateHigh();
			} else if (now - this._collection[this._current].startTime >= this._medium) {
				this._animateMedium();
			} else if (now - this._collection[this._current].startTime >= this._low) {
				this._animateLow();
			}
			this.reset();
		},
		reset : function() {
			clearTimeout(this._resetTimer);
			var _this = this;
			this._resetTimer = setTimeout(function() {
				_this._animateDown();
			}, 500);

		},
		_workerMethod:'(function() { var CPUWorker = { _time:null, _high:700, _medium:600, _low:500, init:function(){ var _this = this; self.addEventListener("message", function(e){_this.onMessage(e);}); this._time=new Date(); setInterval(function(){ _this.check(); },500); }, check:function(){ var now = new Date(); var elapsed = now-this._time; var message = "none"; if(elapsed>=this._high) { message="high"; }else if(elapsed>=this._medium) { message="medium"; }else if(elapsed>this._low) { message="low"; } self.postMessage({type:message,elapsed:elapsed}); }, onMessage : function(e) { this._time= e.data; } }; CPUWorker.init(); })(); '
	};

	return new cpu();
})();
