/*jshint esversion: 6 */
class Slider{
	constructor(_stage, _settings) {		
		//Default settings
		this.settings = {
			duration: 5000,
			autoplay: true,
			buttons: true,
			durationHeaderSlide: null,
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
			
			if(_settings.buttons !== undefined) {
				if(typeof _settings.buttons !== "boolean")
					console.warn("slider: The 'buttons' value must be a boolean");
				else
				   this.settings.buttons = _settings.buttons;
			}
		
			if(_settings.durationHeaderSlide !== undefined) {
				if(_settings.durationHeaderSlide !== null && (typeof _settings.durationHeaderSlide !== "number" || _settings.durationHeaderSlide <= 0))
					console.warn("slider: The 'durationHeaderSlide' value must be a number greater than 0 or null");
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
		this.stage = _stage;
		
		if(this.settings.buttons === true) {
			this.buttonback = document.createElement("div");
			this.buttonnext = document.createElement("div");
			
			this.buttonback.classList.add("sliderbutton");
			this.buttonnext.classList.add("sliderbutton");
			
			this.buttonback.onclick = ()=>{this.back();};
			this.buttonnext.onclick = ()=>{this.next();};
			
			this.stage.appendChild(this.buttonback);
			this.stage.appendChild(this.buttonnext);
		}		
		
		this.index = 0;
		this.slides = this.stage.querySelectorAll(".slide");
		this.go = this.settings.autoplay;
		
		
		this.slides[0].classList.add("noTransition");
		this.slides[0].classList.add("sel");
		setTimeout(()=>{this.slides[0].classList.remove("noTransition");},100);
		
		if(this.settings.autoplay) {
			this.time = setTimeout(()=>{this.next();}, (this.settings.durationHeaderSlide !== null) ? this.settings.durationHeaderSlide : this.settings.duration);
		}
	}
	
	next()
	{
		clearTimeout(this.time);
		
		let nextindex = (this.index === this.slides.length - 1) ? 0 : this.index + 1;
		
		this.slides[nextindex].classList.add("sel");
		this.slides[this.index].classList.remove("sel");

		if(this.settings.removeHeaderSlide === true && this.index === 0) {
			this.slides[0].classList.add("hide");
			this.settings.removeHeaderSlide = false;
			this.slides = this.stage.querySelectorAll(".slide:not(.hide)");
			nextindex = 0;
		}
		this.index = nextindex;
		
		if(this.go) this.time = setTimeout(()=>{this.next();},this.settings.duration);
	}
	back()
	{
		clearTimeout(this.time);
		
		let nextindex = (this.index === 0) ? this.slides.length - 1 : this.index - 1;
		
		this.slides[nextindex].classList.add("sel");
		this.slides[this.index].classList.remove("sel");

		if(this.settings.removeHeaderSlide === true && this.index === 0) {
			this.slides[0].classList.add("hide");
			this.settings.removeHeaderSlide = false;
			this.slides = this.stage.querySelectorAll(".slide:not(.hide)");
			nextindex = this.slides.length - 1;
		}
		this.index = nextindex;
		
		if(this.go) this.time = setTimeout(()=>{this.next();},this.settings.duration);
	}
	
	pause()
	{
		this.go = false;
		clearTimeout(this.time);
	}
	play()
	{
		this.go = true;
		this.time = setTimeout(()=>{this.next();},this.settings.duration);
	}
}