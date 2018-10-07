/*jshint esversion: 6 */
var Slider;
var Slide;
(()=>{
"use strict";
Slider = Slider ||//Avoids multiple declarations
class Slider extends EventTarget {
	constructor(_stage, _settings) {	
		super();
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
		
		this.isLoaded = false;
		
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
		this.slides = Slide.list(this.stage.querySelectorAll(".slide"));
		this.go = this.settings.autoplay;
		
		this.stage.classList.add("slidestransition");//Improved the compatibilty with ajax
		
		var a;
		this.timer = setTimeout(a = () => {
			if(this.slides[0].isLoaded === false) {
				this.timer = setTimeout(a,100);
				return;
			}
			
			this.slides[0].select();
			
			if(this.settings.autoplay) {
				this.timer = setTimeout(()=>{this.next();}, (this.settings.durationHeaderSlide !== null) ? this.settings.durationHeaderSlide : this.settings.duration);
			}
		},100);		
	}
	
	next()
	{
		clearTimeout(this.timer);
		
		let nextindex = (this.index === this.slides.length - 1) ? 0 : this.index + 1;
		
		this.slides[nextindex].select();
		this.slides[this.index].deselect();

		if(this.settings.removeHeaderSlide === true && this.index === 0) {
			this.slides[0].hide();
			this.settings.removeHeaderSlide = false;
			this.slides.shift();
			nextindex = 0;
		}
		this.index = nextindex;
		
		if(this.go) this.timer = setTimeout(()=>{this.next();},this.settings.duration);
	}
	back()
	{
		clearTimeout(this.timer);
		
		let nextindex = (this.index === 0) ? this.slides.length - 1 : this.index - 1;
		
		this.slides[nextindex].select();
		this.slides[this.index].deselect();

		if(this.settings.removeHeaderSlide === true && this.index === 0) {
			this.slides[0].hide();
			this.settings.removeHeaderSlide = false;
			this.slides.shift();
			nextindex = this.slides.length - 1;
		}
		this.index = nextindex;
		
		if(this.go) this.timer = setTimeout(()=>{this.next();},this.settings.duration);
	}
	
	pause()
	{
		this.go = false;
		clearTimeout(this.timer);
	}
	play()
	{
		this.go = true;
		this.timer = setTimeout(()=>{this.next();},this.settings.duration);
	}
}
Slide = Slide ||//Avoids multiple declarations
class Slide extends EventTarget {
	constructor(_slide) {
		super();
		
		this.node = _slide;		
		this.isLoaded = false;
		let image;
		if(image = window.getComputedStyle(this.node)["background-image"].match(/^url\(\"(.*)\"\)$/)) {
			image = image[1];
			this.supportNode = document.createElement("img");
			this.supportNode.style.display = "none";
			this.supportNode.addEventListener("load",()=>{
				this.isLoaded = true;
				this.dispatchEvent(new Event("loaded"));
				this.supportNode.parentNode.removeChild(this.supportNode);
			});
			this.supportNode.src = image;
			document.body.appendChild(this.supportNode);
		} else this.isLoaded = true;
	}
	select()
	{
		this.node.classList.add("sel");
	}
	deselect()
	{
		this.node.classList.remove("sel");
	}
	hide()
	{
		this.node.classList.add("hide");		
	}
	static list(nodes)
	{
		let list = [];
		nodes.forEach((e)=>{
			list.push(new Slide(e));
		});
		return list;
	}	
}
})();