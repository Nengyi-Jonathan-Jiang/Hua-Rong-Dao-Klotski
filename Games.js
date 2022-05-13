class Game{
	constructor(){
		/** @type {Map<string, Scene>} */
		this.scenes = new Map();

		/** @type {String} */
		this.currScene = null;

		window.addEventListener("keydown",e=>{
			this.currScene = this.scenes.get(this.currScene)?.events?.keydown?.(e) || this.currScene;
		})
		window.addEventListener("keyup",e=>{
			this.currScene = this.scenes.get(this.currScene)?.events?.keyup?.(e) || this.currScene;
		})
		window.addEventListener("keypress",e=>{
			this.currScene = this.scenes.get(this.currScene)?.events?.keypress?.(e) || this.currScene;
		})
		window.addEventListener("mousedown",e=>{
			this.currScene = this.scenes.get(this.currScene)?.events?.mousedown?.(e) || this.currScene;
		})
		window.addEventListener("mouseup",e=>{
			this.currScene = this.scenes.get(this.currScene)?.events?.mouseup?.(e) || this.currScene;
		})
		window.addEventListener("click",e=>{
			this.currScene = this.scenes.get(this.currScene)?.events?.click?.(e) || this.currScene;
		})
	}
	/** @param {string} name @param {Scene} scene */
	addScene(name, scene){
		this.scenes.set(name, scene);
	}
	/** @param {string} name */
	run(name){
		this.currScene = name;
		const f = ()=>{
			const scene = this.scenes.get(this.currScene);
			const next = scene.run();
			this.currScene = next || this.currScene;
			if(this.currScene == "QUIT") return;
			requestAnimationFrame(f);
		}
		requestAnimationFrame(f);
	}

	/** @param {String} scene */
	gotoScene(scene){
		this.currScene = scene;
	}
}

/**
 * @typedef {{
 * 	keydown : 	(e:KeyboardEvent)=>string,
 * 	keyup : 	(e:KeyboardEvent)=>string,
 * 	keypress : 	(e:KeyboardEvent)=>string,
 * 	mousedown : (e:MouseEvent)=>string,
 * 	mouseup : 	(e:MouseEvent)=>string,
 * 	click : 	(e:MouseEvent)=>string
 * }} SceneEventListeners
 */
/**
 * @typedef {{
 * 	events : SceneEventListeners
 * }} SceneOptions
 */
class Scene{
	/** @param {()=>string} run @param {SceneOptions} options */
	constructor(run, options){
		this.run = run;
		this.events = options.events;
	}
}