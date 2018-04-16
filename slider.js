class Slider{
	constructor(_stage, _settings) {
		this.stage = _stage;
		self = this;
		
		//Default settings
		this.settings = {
			duration: 5000,
			autoplay: true,
			hideHeaderSlides: null,
			hideHeaderTime: null,
			durationHeaderSlide: 5000,
			removeHeaderSlide: false
		};
		
		//Settings
		if(typeof _settings !== "undefined") {

			if(_settings.duration !== undefined) {
				if(typeof _settings.duration !== "number" || _settings.duration <= 0)
					console.warn("slider: The 'duration' value must be a number greater than 0");
				else
				   this.settings.duration = _settings.duration;
			}
			
			if(_settings.autoplay !== undefined) {
				if(typeof _settings.autoplay !== "boolean")
					console.warn("slider: The 'duration' value must be a boolean");
				else
				   this.settings.autoplay = _settings.autoplay;
			}
			
			if(_settings.hideHeaderSlides !== undefined) {
				if(typeof _settings.hideHeaderSlides !== "number" || _settings.hideHeaderSlides <= 0)
					console.warn("slider: The 'hideHeaderSlides' value must be a number greater than 0");
				else
					this.settings.hideHeaderSlides = _settings.hideHeaderSlides;
			}			
			if(_settings.hideHeaderTime !== undefined) {
				if(typeof _settings.hideHeaderTime !== "number" || _settings.hideHeaderTime <= 0)
					console.warn("slider: The 'hideHeaderTime' value must be a number greater than 0");
				else if(this.settings.hideHeaderSlides !== null)
					console.warn("slider: 'hideHeaderTime' or 'hideHeaderSlides'; only one of these can be defined");
				else
					this.settings.hideHeaderTime = _settings.hideHeaderTime;
			}
		
			if(_settings.durationHeaderSlide !== undefined) {
				if(typeof _settings.durationHeaderSlide !== "number" || _settings.durationHeaderSlide <= 0)
					console.warn("slider: The 'durationHeaderSlide' value must be a number greater than 0");
				else
					this.settings.durationHeaderSlide = _settings.durationHeaderSlide;
			}
			if(_settings.removeHeaderSlide !== undefined) {
				if(typeof _settings.removeHeaderSlide !== "boolean")
					console.warn("slider: The 'removeHeaderSlide' value must be a boolean");
				else
				   this.settings.removeHeaderSlide = _settings.removeHeaderSlide;
			}
		}
		
		//Initialization
		this.index = 1;
		this.number = this.stage.children(".slide").length;
		this.go = this.settings.autoplay;
		
		this.stage.children(".slide:first").addClass("noTransition").addClass("sel").delay(100).queue(function(){
			self.stage.children(".slide:first").removeClass("noTransition");
		});
		
		if(this.settings.hideHeaderSlides !== null) {
			this.count = 0;
		}
		if(this.settings.hideHeaderTime !== null) {
			setTimeout(function() {
				self.hideHeader();
			}, this.settings.hideHeaderTime);
		}
		
		if(this.settings.removeHeaderSlide === true && this.stage.children("header.slide").length === 1) {
			this.number--;
			let int = setInterval(function() {
				if(self.go) {
					clearInterval(int);
					
					self.stage.children(".sel").removeClass("sel");
					self.stage.children(".slide:nth-child(2)").addClass("sel")
						.delay(self.settings.duration/2).queue(function(){
						self.stage.children("header.slide").remove();
					});

					setInterval(function(){
						if(self.go) self.next();
					}, self.settings.duration);
				}
			}, this.settings.durationHeaderSlide);
		} else {
			setInterval(function(){
				if(self.go) self.next();
			}, this.settings.duration);
		}
	}
	
	next() {
		if(this.settings.hideHeaderSlides !== null) {
			this.count++;
			if(this.count === this.settings.hideHeaderSlides) {
				this.hideHeader();
				this.settings.hideHeaderSlides = null;
			}
		}
		
		this.stage.children(".sel").removeClass("sel");
		this.index = this.index + 1;
		if(this.index > this.number) this.index = 1;
		this.stage.children(".slide:nth-child("+this.index+")").addClass("sel");
	}
	
	pause() {
		this.go = false;
	}
	play() {
		this.go = true;		
	}
	
	hideHeader() {
		this.stage.children("header:not(.slide)").addClass("hide");
	}
}