//Get DOM elements
const el_container = document.getElementById("container");
const el_scene_menu = document.getElementById("menu");
const el_scene_level_select = document.getElementById("level-selection");
const el_scene_level_description = document.getElementById("level-description");
const el_scene_game = document.getElementById("game");
const el_scene_game_menu = document.getElementById("game-menu");

const btn_menu_play = document.getElementById("play");
const btn_menu_settings = document.getElementById("settings");
const btn_menu_about = document.getElementById("about");

const btn_level_select_exit = document.getElementById("select-exit");

const el_level_select_levels = document.getElementById("levels");

const btn_level_description_back = document.getElementById("ls-back");
const btn_level_description_play = document.getElementById("ls-next");

const el_level_description_game_view = document.getElementById("level-preview");
const el_game_game_view = document.getElementById("game-canvas");

const span_info = document.getElementById("info");

const btn_game_hint = document.getElementById("game-hint");
const btn_game_menu = document.getElementById("game-goto-menu");
const btn_game_redo = document.getElementById("game-redo");
const btn_game_undo = document.getElementById("game-undo");

function hide(el){el.setAttribute("data-hidden", "true");}
function show(el){el.setAttribute("data-hidden", "false");}
function blur(el){el.setAttribute("data-blur", "true");}
function unblur(el){el.setAttribute("data-blur", "false");}

// Handle resize event

let w, h, s;

let game = new Game(el_container);

// Simple button class

function hint(grid){
	// If the webassembly version (which is slightly faster) of
	// getHint has loaded, use that versions
	if(wasmGetHint) return wasmGetHint(grid.toString());
	// Otherwise use the plain JS version
	return Solver.getHint(grid.toString())
}

function applyMove(grid, move){
	let [x, y, direction] = move;
	switch(direction){
		case "LEFT":
			g.moveL(x, y); break;
		case "RIGHT":
			g.moveR(x, y); break;
		case "UP":
			g.moveT(x, y); break;
		case "DOWN":
			g.moveB(x, y); break;
	}
	animation = 0;
}
let usedHints = 0;

let LEVEL;
let g;

let prevX, prevY;

game.addScene("Menu", new Scene(function(){}, {
	ui:{
		buttons: [
			new UIButton(btn_menu_settings, function(){
				console.log("settings");
			}),
			new UIButton(btn_menu_about, function(){
				console.log("about");
			}),
			new UIButton(btn_menu_play, function(gotoScene){
				gotoScene("LevelSelect", null);
			}),
		]
	}
}, function(){
	hide(el_scene_level_description);
	hide(el_scene_game);
	hide(el_scene_game_menu);
	hide(el_scene_level_select);
	
	show(el_scene_menu);
}))

game.addScene("LevelSelect", new Scene(function(){}, {
	ui : {
		buttons : [
			new UIButton(btn_level_select_exit, function(gotoScene){
				gotoScene("Menu");
			}),
			...LEVELS.map((level, i)=>{
				let btn = document.createElement("button");
				btn.className = "level";
				el_level_select_levels.appendChild(btn);
				return new UIButton(btn, function(gotoScene, data){
					data.currLevel = i;
					level.generate(el_level_description_game_view);
					gotoScene("LevelDescription");
				})
			}),
		]
	}
}, function(){
	hide(el_scene_menu);
	hide(el_scene_level_description);
	hide(el_scene_game);
	hide(el_scene_game_menu);
	
	unblur(el_scene_level_select);
	show(el_scene_level_select);
}))

game.addScene("LevelDescription", new Scene(function(){}, {
	ui: {
		buttons : [
			new UIButton(btn_level_description_back, function(gotoScene, data){
				data.currLevel = -1;
				gotoScene("LevelSelect");
			}),
			new UIButton(el_scene_level_select, function(gotoScene, data){
				data.currLevel = -1;
				gotoScene("LevelSelect");
			}),
			new UIButton(btn_level_description_play, function(gotoScene){
				gotoScene("Level");
			}),
		]
	}
}, function(){
	hide(el_scene_menu);
	hide(el_scene_game);
	hide(el_scene_game_menu);
	
	blur(el_scene_level_select);
	show(el_scene_level_select);
	show(el_scene_level_description);
}))

game.addScene("Level", new Scene(function(gotoScene, data){
	let g = data.gameBoard;
	if(g.pieces[0].y == 6 && !g.isAnimating) return gotoScene("Win");
	if(g.pieces[0].x == 1 && g.pieces[0].y == 3 && !g.isAnimating) g.pieces[0].y = 6;
	
}, {
	events: {
		mousedown : (e, data)=>{
			data.selectedPiece = data.gameBoard.pieces[e.target.dataset.index]
			data.mouseDownX = e.clientX - el_game_game_view.getBoundingClientRect().x;
			data.mouseDownY = e.clientY - el_game_game_view.getBoundingClientRect().y;
		},
		mousemove : (e, data) => {
			if(data.selectedPiece){
				if(data.gameBoard.isAnimating) return;

				let dx = e.clientX - el_game_game_view.getBoundingClientRect().x - data.mouseDownX;
				let dy = e.clientY - el_game_game_view.getBoundingClientRect().y - data.mouseDownY;
			
				if(dx * dx + dy * dy < 5) return;	//Prevent small swipe
				
				let angle = (Math.round(Math.atan2(dy, dx) / Math.PI  * 2) + 2) & 3;
				let piece = data.selectedPiece;
			
				if(piece.isAnimating) return;

				if(g["moveL|moveT|moveR|moveB".split("|")[angle]](piece.x, piece.y)){
					info.innerText = ++data.moves;
				}
			}
			data.selectedPiece = data.mouseDownX = data.mouseDownY = null;
		},
		mouseup : (e, data) => {
			if(data.selectedPiece){
				if(data.gameBoard.isAnimating) return;

				let dx = e.clientX - el_game_game_view.getBoundingClientRect().x - data.mouseDownX;
				let dy = e.clientY - el_game_game_view.getBoundingClientRect().y - data.mouseDownY;
				
				if(dx * dx + dy * dy < 5) return;	//Prevent small swipe

				let angle = (Math.round(Math.atan2(dy, dx) / Math.PI  * 2) + 2) & 3;
				let piece = data.selectedPiece;
			
				if(g["moveL|moveT|moveR|moveB".split("|")[angle]](piece.x, piece.y)){
					info.innerText = ++data.moves;
				};

			}
			data.selectedPiece = data.mouseDownX = data.mouseDownY = null;
		}
	}
}, function(data){
	hide(el_scene_menu);
	hide(el_scene_level_select);
	hide(el_scene_level_description);
	hide(el_scene_game_menu);
	
	unblur(el_scene_game);
	show(el_scene_game);
	
	g = data.gameBoard = LEVELS[data.currLevel].generate(el_game_game_view);
	info.innerText = data.moves = 0;
	data.hints = 0;
	console.log(data);
}));

game.addScene("Win", new Scene(_=>{

}, {
	events: {
		click : _=>{
			document.title = "华容道（Klotski)"
			return "LevelSelect";
		}
	}
}));

// game.run("Level");
game.run("Menu");