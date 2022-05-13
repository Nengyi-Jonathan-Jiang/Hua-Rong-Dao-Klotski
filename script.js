//Set up canvas

let canvas = new Canvas(0, 0, document.getElementById("container"), true, false);
let ctx = canvas.ctx;
canvas.setTextAlign("center");
canvas.setTextBaseline("middle");

// Handle resize event

let w, h, s;
window.onresize = (f=>(f(),f))(_=>{
	canvas.resize();
	w = canvas.width;
	h = canvas.height;
	s = w / 5;
});

// Simple button class

class Button{
	constructor(onclick, x, y, width, height, text, textSize){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.text = text || "";
		this.textSize = textSize;
		this.onclick = onclick;
	}
	draw(fill1, fill2){
		const [x, y, width, height, textSize] = [this.x, this.y, this.width, this.height, this.textSize].map(i => i * s);
		const r = .125 * s;

		canvas.setFillColor(fill1);
		canvas.setStrokeColor("#000");

		canvas.fillSquircle(x, y, width, r);
		canvas.drawSquircle(x, y, width, r);

		canvas.setFillColor(fill2);

		canvas.setTextAlign("center");
		canvas.setTextBaseline("middle");
		canvas.setFontWeight('bolder');

		canvas.fillText(this.text, x, y, textSize);
		canvas.drawText(this.text, x, y, textSize);
	}
	isMouseOver(mx, my){
		const [x, y, width, height] = [this.x, this.y, this.width, this.height].map(i=>i * s);
		return mx >= x - width / 2 && mx <= x + width / 2 && my >= y - height / 2 && my <= y + height / 2;
	}
}

function hint(grid){return Solver.getHint(grid.toString())}

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

let LEVEL = LEVELS[+(window.location.hash || "#4").substring(1)];
let g = LEVEL.generate();
document.title = "华容道（Klotski）| " + LEVEL.name;
window.onhashchange = _ => window.location.reload();

const btns = [
	new Button(_=>{
		if(animation < 1 || game.currScene == "Win") return;
		applyMove(g, hint(g));
		usedHints++;
	}, 3.75, 0.25, .4, .4, "?", .3),
	new Button(_=>{
		g = LEVEL.generate();
	}, 4.25, 0.25, .4, .4, "↺", .3),
	new Button(_=>{
		game.gotoScene("Menu");
	}, 4.75, 0.25, .4, .4, "X", .3),
]

let prevX, prevY, selectedPiece;

canvas.ontouchstart = e=>{
	canvas.onmousedown(e.touches[0]);
};
window.ontouchend = e=>{
	window.onmouseup(e.changedTouches[0]);
};

let animation = 1;
function distort(x){
	x = Math.min(Math.max(x, 0), 1);
	return x * x * (3 - 2 * x);
}

let game = new Game();

game.addScene("Menu", new Scene(_=>{
	canvas.clear();

	canvas.setStrokeWidth(2);

	canvas.drawRect(1, 1, w - 1, h - 1);

	canvas.setFillColor("#FFF");	
	canvas.setStrokeWidth(1);

	canvas.fillText("华容道", w/2, h * .4, w * .1428);
	canvas.drawText("华容道", w/2, h * .4, w * .1428);

	canvas.fillText("Click anywhere to play", w/2, h * .55, w * 0.076923);
	canvas.drawText("Click anywhere to play", w/2, h * .55, w * 0.076923);
}, {
	events: {
		click : _=>{
			return "LevelSelect";
		}
	}
}))

game.addScene("LevelSelect", new Scene(_=>{
	canvas.clear();

	canvas.setStrokeWidth(2);

	canvas.drawRect(1, 1, w - 1, h - 1);

	canvas.setStrokeWidth(1);

	canvas.setFillColor("#FFF");
	canvas.setTextAlign("center");
	canvas.setTextBaseline("middle");
	canvas.fillText("Level Select", w/2, h * .25, s * .8);
	canvas.drawText("Level Select", w/2, h * .25, s * .8);

	for(let x = 0, y = 0, i = 0; i < LEVELS.length; i++){
		x = i % 6;
		y = Math.floor(i / 6);
		let xx = ((x - 2.5) * .8 + 2.5) * s, yy = ((y - Math.ceil(LEVELS.length / 6) / 2 + 1) * .8 + 3) * s;

		canvas.setFillColor("#8888");
		canvas.fillSquircle(xx, yy, s * .5, s * .1);
		canvas.drawSquircle(xx, yy, s * .5, s * .1);

		canvas.setFillColor("#FFF");
		canvas.setTextAlign("center");
		canvas.setTextBaseline("middle");
		canvas.fillText(i + 1, xx, yy, s * .25);
		canvas.drawText(i + 1, xx, yy, s * .25);
	}
}, {
	events: {
		click : _=>{

			g = LEVEL.generate();
			return "Level";
		}
	}
}))

game.addScene("Level", new Scene(_=>{

	if(animation < 1){
		animation += 1 / 8;
		if(animation >= 1){
			for(let piece of g.pieces){
				piece.px = piece.x;
				piece.py = piece.y;
			}
			animation = 1;
		}
	}

	ctx.clearRect(0,0,w,h);

	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000";
	ctx.strokeRect(1,1,s * 5 - 2,s * 6 - 2);
	ctx.strokeRect(s/2,s/2,s * 4,s * 5);
	ctx.strokeRect(s * 1.5, s * 5.5, s * 2, s * .5 - 1);
	ctx.clearRect(s * 1.5 + 1, s * 5.5 - 1, s * 2 - 2, s * .5 + 2)
	ctx.lineWidth = 1;

	let i = 0;
	for(let piece of g.pieces){
		const {x, y, px, py, constructor:{dimensions:[dx,dy]}} = piece;

		let xx = px + distort(animation) * (x - px);
		let yy = py + distort(animation) * (y - py);
		
		ctx.fillStyle = "#000";
		ctx.fillRect((xx + .5) * s, (yy + .5) * s, dx * s, dy * s);

		switch(piece.constructor){
			case SmallPiece:
				ctx.fillStyle = "#ec7063";
				break;
			case HorizontalPiece:
			case VerticalPiece:
				ctx.fillStyle = "#2196f3";
				break;
			case LargePiece:
				ctx.fillStyle = "#4caf50";
				break;
			
			default: ctx.fillStyle = "#888";
		}

		ctx.fillRect((xx + .5) * s + 1, (yy + .5) * s + 1, dx * s - 2, dy * s - 2);

		
		ctx.fillStyle = "#FFF";
		ctx.fillText(i, (xx + .5 + dx / 2) * s, (yy + .5 + dy / 2) * s);
		ctx.strokeText(i++, (xx + .5 + dx / 2) * s, (yy + .5 + dy / 2) * s);
	}

	if(selectedPiece){
		const {x, y, px, py, constructor:{dimensions:[dx,dy]}} = selectedPiece;

		let xx = px + distort(animation) * (x - px);
		let yy = py + distort(animation) * (y - py);
		
		ctx.strokeStyle = "#FF0";
		ctx.strokeRect((xx + .5) * s + 1, (yy + .5) * s + 1, dx * s - 2, dy * s - 2);
	}

	if(g.pieces[0].x == 1 && g.pieces[0].y == 3 && animation == 1){g.pieces[0].y += 3;animation = 0}
	if(g.pieces[0].x == 1 && g.pieces[0].y == 6 && animation == 1){return "Win"}

	for(let button of btns) button.draw("#0008", "#FFF");
}, {
	events: {
		mousedown : e=>{
			let bb = canvas.canvas.getBoundingClientRect();
			let [x, y] = [e.clientX - bb.x, e.clientY - bb.y];
			
			[prevX, prevY] = [x / s - .5, y / s - .5];
		},
		
		click : e=>{
			let bb = canvas.canvas.getBoundingClientRect();
			let [x, y] = [e.clientX - bb.x, e.clientY - bb.y];
			
			for(let button of btns){
				if(button.isMouseOver(x, y)){
					button.onclick();
					return;
				}
			}
		},
		
		keydown : e=>{
			console.log(e.which);
			if(e.which <= 40 && e.which >= 37){
				if(selectedPiece){
					if(animation < 1) return;
					
					let piece = selectedPiece;
				
					if(piece && g["moveL|moveT|moveR|moveB".split("|")[e.which - 37]](piece.x, piece.y))
						animation = 0;
				
					[prevX, prevY] = [-1, -1];
				
					// selectedPiece = null;
					
				}
				return;
			}
			if(isNaN(+e.key)) return;
			// if(selectedPiece) return selectedPiece = null, [prevX, prevY] = [-1, -1];;
			selectedPiece = g.pieces[+e.key]
		},
		
		mouseup : e => {
			if(animation < 1) return;
		
			let bb = canvas.canvas.getBoundingClientRect();
			let [currX, currY] = [(e.clientX - bb.x) / s - .5, (e.clientY - bb.y) / s - .5];
			let [dx, dy] = [currX - prevX, currY - prevY];
			let angle = (Math.round(Math.atan2(dy, dx) / Math.PI  * 2) + 2) & 3;
			selectedPiece = g.getPiece(~~prevX, ~~prevY);
			let piece = selectedPiece;
		
			if(piece && g["moveL|moveT|moveR|moveB".split("|")[angle]](piece.x, piece.y))
				animation = 0;
		
			[prevX, prevY] = [-1, -1];
		
			selectedPiece = null;
		}

	}
}));

game.addScene("Win", new Scene(_=>{
	ctx.clearRect(0,0,w,h);

	ctx.strokeStyle = "#000";
	ctx.strokeRect(1,1,s * 5 - 2,s * 6 - 2);
	ctx.strokeRect(s/2,s/2,s * 4,s * 5);
	ctx.strokeRect(s * 1.5, s * 5.5, s * 2, s * .5 - 1);
	ctx.clearRect(s * 1.5 + 1, s * 5.5 - 1, s * 2 - 2, s * .5 + 2)

	for(let piece of g.pieces){
		const {x, y, constructor:{dimensions:[dx,dy]}} = piece;
		switch(piece.constructor){
			case SmallPiece:
				ctx.fillStyle = "#ec7063";
				break;
			case HorizontalPiece:
			case VerticalPiece:
				ctx.fillStyle = "#2196f3";
				break;
			case LargePiece:
				ctx.fillStyle = "#4caf50";
				break;
			
			default: ctx.fillStyle = "#888";
		}
		ctx.fillRect((x + .5) * s, (y + .5) * s, dx * s, dy * s);
	}
	for(let piece of g.pieces){
		const {x, y, constructor:{dimensions:[dx,dy]}} = piece;
		let px = x, py = y;
		ctx.strokeRect((px + .5) * s, (py + .5) * s, dx * s, dy * s);
	}

	ctx.fillStyle = "#4caf5088";
	ctx.fillRect(0,0,w,h);
	ctx.fillStyle = "#FFF"
	ctx.strokeStyle = "#000"
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	ctx.font = `${w / 7}px Arial`;
	ctx.fillText("You solved it!", w/2, h/2);
	ctx.strokeText("You solved it!", w/2, h/2);

	ctx.font = `${w / 16}px Arial`;
	ctx.fillText(`using ${usedHints} hints`, w/2, h * .58);
	ctx.strokeText(`using ${usedHints} hints`, w/2, h * .58);
}, {
	events: {
		click : _=>{
			
			return "LevelSelect";
		}
	}
}));

// game.run("Level");
game.run("Menu");