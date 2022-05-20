//Get DOM elements
const el_container = document.getElementById("container");
const el_scene_menu = document.getElementById("menu");
const el_scene_how_to_play = document.getElementById("how-to-play");
const el_scene_level_select = document.getElementById("level-selection");
const el_scene_level_description = document.getElementById("level-description");
const el_scene_game = document.getElementById("game");
const el_scene_game_win = document.getElementById("game-win");

const btn_menu_play = document.getElementById("play");
const btn_menu_how_to_play = document.getElementById("instructions");

const btn_how_to_play_return = document.getElementById("how-to-play-return");

const btn_level_select_exit = document.getElementById("select-exit");

const el_level_select_levels = document.getElementById("levels");

const btn_level_description_back = document.getElementById("ls-back");
const btn_level_description_play = document.getElementById("ls-next");
const p_level_description_title = document.getElementById("level-description-title");
const p_level_description_text = document.getElementById("level-description-text");

const el_level_description_game_view = document.getElementById("level-preview");
const el_game_game_view = document.getElementById("game-canvas");

const span_info = document.getElementById("info");
const p_game_title = document.getElementById("game-level-title");

const btn_game_hint = document.getElementById("game-hint");
const btn_game_menu = document.getElementById("game-goto-menu");
const btn_game_exit = document.getElementById("game-exit");
const btn_game_restart = document.getElementById("game-restart");
const el_game_options = document.getElementById("game-options");

const p_win_moves = document.getElementById("win-moves");
const p_win_hints = document.getElementById("win-hints");

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
			new UIButton(btn_menu_how_to_play, function(gotoScene){
				gotoScene("Instructions")
			}),
			new UIButton(btn_menu_play, function(gotoScene){
				gotoScene("LevelSelect");
			}),
		]
	}
}, function(){
	hide(el_scene_level_description);
	hide(el_scene_game);
	hide(el_scene_game_win);
	hide(el_scene_level_select);
	hide(el_scene_how_to_play);
	
	show(el_scene_menu)
}))

game.addScene("Instructions", new Scene(function(){}, {
	ui:{
		buttons: [
			new UIButton(btn_how_to_play_return, function(gotoScene){
				gotoScene("Menu");
			}),
		]
	}
}, function(){
	hide(el_scene_level_description);
	hide(el_scene_game);
	hide(el_scene_game_win);
	hide(el_scene_level_select);
	hide(el_scene_menu)

	show(el_scene_how_to_play);
}))

game.addScene("LevelSelect", new Scene(function(){}, {
	ui : {
		buttons : [
			new UIButton(btn_level_select_exit, function(gotoScene){
				gotoScene("Menu");
			}),
			...LEVELS.map((level, i)=>{
				let btn = document.createElement("button");
				btn.classList.add("level");
				btn.classList.add("diff-"+level.difficulty);
				el_level_select_levels.appendChild(btn);
				return new UIButton(btn, function(gotoScene, data){
					data.currLevel = i;
					gotoScene("LevelDescription");
				})
			}),
		]
	}
}, function(){
	hide(el_scene_menu)
	hide(el_scene_how_to_play);
	hide(el_scene_level_description);
	hide(el_scene_game);
	hide(el_scene_game_win);
	
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
}, function(data){
	hide(el_scene_menu)
	hide(el_scene_how_to_play);
	hide(el_scene_game);
	hide(el_scene_game_win);

	LEVELS[data.currLevel].generate(el_level_description_game_view);
	p_level_description_title.innerText = LEVELS[data.currLevel].name;
	p_level_description_text.innerText = LEVELS[data.currLevel].description;

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
			let {selectedPiece, mouseDownX, mouseDownY, gameBoard} = data;

			let mx = e.clientX - el_game_game_view.getBoundingClientRect().x;
			let my = e.clientY - el_game_game_view.getBoundingClientRect().y;

			data.mouseDownX = mx;
			data.mouseDownY = my;

			if(selectedPiece){
				if(gameBoard.isAnimating) return;

				let dx = mx - mouseDownX;
				let dy = my - mouseDownY;
				
				let angle = (Math.round(Math.atan2(dy, dx) / Math.PI  * 2) + 2) & 3;
			
				if(!g[["moveL","moveT","moveR","moveB"][angle]](selectedPiece.x, selectedPiece.y)) return;

				info.innerText = ++data.moves;
			}
		},
		mouseup : (e, data) => {
			let {selectedPiece, mouseDownX, mouseDownY, gameBoard} = data;
			data.selectedPiece = data.mouseDownX = data.mouseDownY = null;

			if(selectedPiece){
				if(gameBoard.isAnimating) return;

				let dx = e.clientX - el_game_game_view.getBoundingClientRect().x - mouseDownX;
				let dy = e.clientY - el_game_game_view.getBoundingClientRect().y - mouseDownY;
				
				if(dx * dx + dy * dy <= 1) return;	//Prevent small swipe

				let angle = (Math.round(Math.atan2(dy, dx) / Math.PI  * 2) + 2) & 3;
			
				if(!g[["moveL","moveT","moveR","moveB"][angle]](selectedPiece.x, selectedPiece.y)) return;
				
				info.innerText = ++data.moves;
			}
		}
	},
	ui: {
		buttons: [
			new UIButton(btn_game_exit, function(gotoScene, data){
				gotoScene("LevelSelect");
			}),
			new UIButton(btn_game_hint, function(gotoScene, data){
				let g = data.gameBoard;
				if(g.isAnimating) return;
				applyMove(g, hint(g));
				data.hints++;
				info.innerText = ++data.moves;
			}),
			new UIButton(btn_game_menu, function(){
				el_game_options.dataset.extended = !(el_game_options.dataset.extended == "true");
			}),
			new UIButton(btn_game_restart, function(gotoScene){
				gotoScene("Level");
			}),
		]
	}
}, function(data){
	hide(el_scene_menu)
	hide(el_scene_how_to_play);
	hide(el_scene_level_select);
	hide(el_scene_level_description);
	hide(el_scene_game_win);
	
	p_game_title.innerText = LEVELS[data.currLevel].name;

	el_game_options.dataset.extended = "false";
	
	g = data.gameBoard = LEVELS[data.currLevel].generate(el_game_game_view);
	info.innerText = data.moves = 0;
	data.hints = 0;
	
	unblur(el_scene_game);
	show(el_scene_game);
}));

game.addScene("Win", new Scene(_=>{

}, {
	events: {
		click : _=>{
			document.title = "华容道（Klotski)"
			return "LevelSelect";
		}
	}
}, function(data){
	hide(el_scene_menu)
	hide(el_scene_how_to_play);
	hide(el_scene_level_select);
	hide(el_scene_level_description);
	
	blur(el_scene_game);
	show(el_scene_game);
	show(el_scene_game_win);

	p_win_moves.innerText = data.moves;
	p_win_hints.innerText = data.hints;
}));

// game.run("Level");
game.run("Menu");
