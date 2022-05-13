const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d', {antialias:false});

document.getElementById("container").appendChild(canvas);

let w, h, s;


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

		ctx.fillStyle = fill1;
		ctx.strokeStyle = "#000";

		ctx.beginPath();
        ctx.arc(x + width / 2 - r, y - width / 2 + r, r, 3 * Math.PI / 2, 0 * Math.PI / 2);
        ctx.arc(x + width / 2 - r, y + width / 2 - r, r, 0 * Math.PI / 2, 1 * Math.PI / 2);
        ctx.arc(x - width / 2 + r, y + width / 2 - r, r, 1 * Math.PI / 2, 2 * Math.PI / 2);
        ctx.arc(x - width / 2 + r, y - width / 2 + r, r, 2 * Math.PI / 2, 3 * Math.PI / 2);
        ctx.lineTo(x + width / 2 - r, y - width / 2);
        ctx.fill();
		ctx.stroke();
        ctx.closePath();

		ctx.fillStyle = fill2;
		ctx.font = `bold ${textSize}px Arial`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(this.text, x, y);
		ctx.strokeText(this.text, x, y);
	}
	isMouseOver(mx, my){
		const [x, y, width, height] = [this.x, this.y, this.width, this.height].map(i=>i * s);
		return mx >= x - width / 2 && mx <= x + width / 2 && my >= y - height / 2 && my <= y + height / 2;
	}
}


window.onresize = (f=>(f(),f))(_=>{
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
	s = w / 5;
});

/** @param {Grid} grid */
function gridToState(grid){
	let state = ".".repeat(20);
	for(let piece of grid.pieces){
		let {x,y} = piece;
		switch(piece.constructor){
			case SmallPiece:
				state = Solver.setAt(state, x, y, '@');
				break;
			case HorizontalPiece:
				state = Solver.setAt(state, x, y, '<');
				state = Solver.setAt(state, x + 1, y, '>');
				break;
			case VerticalPiece:
				state = Solver.setAt(state, x, y, '^');
				state = Solver.setAt(state, x, y + 1, 'v');
				break;
			case LargePiece:
				state = Solver.setAt(state, x, y, '1');
				state = Solver.setAt(state, x + 1, y, '2');
				state = Solver.setAt(state, x, y + 1, '3');
				state = Solver.setAt(state, x + 1, y + 1, '4');
				break;
		}
	}
	return state;
}

function hint(grid){
	return Solver.getHint(gridToState(grid));
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

const LEVEL = LEVELS[+(window.location.hash || "#4").substr(1)];
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
		window.close();
	}, 4.75, 0.25, .4, .4, "X", .3),
]

let prevX, prevY;
canvas.onmousedown = e=> {
	let bb = canvas.getBoundingClientRect();
	let [x, y] = [e.clientX - bb.x, e.clientY - bb.y];
	for(let button of btns){
		if(button.isMouseOver(x, y)){
			button.onclick();
			return;
		}
	}

	[prevX, prevY] = [x / s - .5, y / s - .5];
}
window.onmouseup = e => {
	if(animation < 1) return;

	let bb = canvas.getBoundingClientRect();
	let [currX, currY] = [(e.clientX - bb.x) / s - .5, (e.clientY - bb.y) / s - .5];
	let [dx, dy] = [currX - prevX, currY - prevY];
	let angle = (Math.round(Math.atan2(dy, dx) / Math.PI  * 2) + 2) & 3;
	let piece = g.getPiece(~~prevX, ~~prevY);

	if(piece && g["moveL|moveT|moveR|moveB".split("|")[angle]](piece.x, piece.y))
		animation = 0;

	[prevX, prevY] = [-1, -1];
}

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

	ctx.strokeStyle = "#000";
	ctx.strokeRect(1,1,s * 5 - 2,s * 6 - 2);
	ctx.strokeRect(s/2,s/2,s * 4,s * 5);
	ctx.strokeRect(s * 1.5, s * 5.5, s * 2, s * .5 - 1);
	ctx.clearRect(s * 1.5 + 1, s * 5.5 - 1, s * 2 - 2, s * .5 + 2)

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
	}

	if(g.pieces[0].x == 1 && g.pieces[0].y == 3 && animation == 1){g.pieces[0].y += 3;animation = 0}
	if(g.pieces[0].x == 1 && g.pieces[0].y == 6 && animation == 1){return "Win"}

	for(let button of btns) button.draw("#0008", "#FFF");
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
}));

game.run("Level");