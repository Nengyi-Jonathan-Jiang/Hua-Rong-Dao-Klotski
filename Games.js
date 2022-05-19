class Game{
	constructor(el){
		this.el = el;
		
		/** @type {Map<string, Scene>} */
		this.scenes = new Map();

		/** @type {String} */
		this.currScene = null;
		/** @type {String} */
		this.nextSceneOverride = null;
		this.nextSceneArgs = {};

		let events = _ => {return this.scenes.get(this.currScene)?.events}
		
		let keyDown = e => {this.gotoScene(events()?.keydown?.(e, this.data))}
		let keyUp = e => {this.gotoScene(events()?.keyup?.(e, this.data))}
		let keyPress = e => {this.gotoScene(events()?.keypress?.(e, this.data))}
		let mouseDown = e => {this.gotoScene(events()?.mousedown?.(e, this.data))}
		let mouseUp = e => {this.gotoScene(events()?.mouseup?.(e, this.data))}
		let mouseMove = e => {this.gotoScene(events()?.mousemove?.(e, this.data))}
		let _click = e => {
			this.gotoScene(events()?.click?.(e))
		}
		let click = e => {
			let target = e.target;
			while(target){
				for(let button of this.scenes.get(this.currScene).ui.buttons){
					if(target === button.el){
						button.action((nextScene,args)=>{
							this._gotoScene(nextScene,args);
						}, this.data);
						return;
					}
				}
				target = target.parentElement;
			}
			_click(e);
		}
		
		window.addEventListener("keydown",keyDown);
		window.addEventListener("keyup",keyUp);
		window.addEventListener("keypress",keyPress);
		window.addEventListener("mousedown",mouseDown)
		window.addEventListener("mouseup",mouseUp);
		window.addEventListener("mousemove",mouseMove);
		window.addEventListener("click",click);
		window.addEventListener("touchstart",e=>mouseDown(e.touches[0]));
		window.addEventListener("touchmove", e=>mouseMove(e.touches[0]));
		window.addEventListener("touchend",({changedTouches:[t]})=>(mouseUp(t),_click(t)));
	}

	_gotoScene(nextScene, args){
		this.nextSceneArgs = args || {};
		this.gotoScene(nextScene);
	}
	
	/** @param {string} name @param {Scene} scene */
	addScene(name, scene){
		this.scenes.set(name, scene);
	}
	/** @param {string} name */
	run(name, args){
		this.currScene = name;

		this.data = {};
		this.scenes.get(name).onstart(this.data, args);
		const f = ()=>{
			const scene = this.scenes.get(this.currScene);
			scene.run((nextScene,args)=>{
				this._gotoScene(nextScene,args);
			}, this.data);

			let next = this.nextSceneOverride;
			
			if(next) this.scenes.get(next).onstart(this.data, this.nextSceneArgs);
			
			this.currScene = next || this.currScene;
			this.nextSceneOverride = null;
			this.nextSceneArgs = null;
			if(this.currScene == "QUIT") return;
			requestAnimationFrame(f);
		}
		requestAnimationFrame(f);
	}

	/** @param {String} scene */
	gotoScene(scene){
		if(scene) this.nextSceneOverride = scene;
	}
}

/**
 * @typedef {{
 * 	keydown : 	(e:KeyboardEvent)=>string,
 * 	keyup : 	(e:KeyboardEvent)=>string,
 * 	keypress : 	(e:KeyboardEvent)=>string,
 * 	mousedown : (e:MouseEvent)=>string,
 * 	mouseup : 	(e:MouseEvent)=>string,
 * 	click : 	(e:MouseEvent)=>string,
 * 	mousemove : (e:MouseEvent)=>string
 * }} SceneEventListeners
 */
/**
 * @typedef {{
 * 	buttons : UIButton[]
 * }} SceneUI
 */
/**
 * @typedef {{
 * 	events : SceneEventListeners
 *  ui : SceneUI
 * }} SceneOptions
 */
class Scene{
	/**
	 * @param {(data:Object)=>string} run
	 * @param {SceneOptions} options
	 * @param {()=>Object} [onstart]
	 */
	constructor(run, options, onstart){
		this.run = run;
		this.onstart = onstart || (_=>{return {}})
		/** @type {SceneEventListeners} */
		this.events = options.events || {};
		/** @type {SceneUI} */
		this.ui = options.ui || {};
		this.ui.buttons ||= [];
	}
}

/** @typedef {(nextScene:string, args:Object)=>any} GotoSceneFunction */

class UIButton{
	/**
	 * @param {HTMLElement} el
	 * @param {(gotoScene: GotoSceneFunction, data: Object)=>any} action
	 */
	constructor(el, action){
		this.el = el;
		/** @type {(gotoScene:GotoSceneFunction,data:Object)=>any} */
		this.action = action || function(){};
	}
}