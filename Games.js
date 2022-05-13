class Game{
	constructor(){
		/** @type {Map<string, Scene>} */
		this.scenes = new Map();

		this.currScene = null;
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
}

class Scene{
	/** @param {()=>string} run */
	constructor(run){
		this.run = run;
	}
}