const canvas = document.createElement("canvas");
const ctx = canvas.getContext('2d');

document.getElementById("container").appendChild(canvas);

let w, h, s;

window.onresize = (f=>(f(),f))(_=>{
    w = canvas.width = canvas.clientWidth;
    h = canvas.height = canvas.clientHeight;
	s = w / 5;
});

const LEVEL = LEVELS[+(window.location.hash || "#4").substr(1)];
let g = LEVEL.generate();
document.title = "华容道（Klotski）| " + LEVEL.name;

let prevX, prevY;
canvas.onmousedown = e=> {
	if(animation) return;

	let bb = canvas.getBoundingClientRect();
	[prevX, prevY] = [(e.clientX - bb.x) / s - .5, (e.clientY - bb.y) / s - .5];
}
window.onmouseup = e => {
	if(animation) return;

	let bb = canvas.getBoundingClientRect();
	let [currX, currY] = [(e.clientX - bb.x) / s - .5, (e.clientY - bb.y) / s - .5];
	let [dx, dy] = [currX - prevX, currY - prevY];
	let [x, y] = [~~prevX, ~~prevY]

	let angle = Math.atan2(dy, dx) / Math.PI  * 2;
	angle = (Math.round(angle) + 2) & 3;

	animation = g["moveL|moveT|moveR|moveB".split("|")[angle]](x, y);
	[prevX, prevY] = [-1, -1];
}
canvas.ontouchstart = e=>{
	canvas.onmousedown(e.touches[0]);
};
window.ontouchend = e=>{
	window.onmouseup(e.changedTouches[0]);
};

let animation;

function frame(){

	if(animation){
		if(animation[2] > 0) animation[2] = Math.max(animation[2] - .1, 0);
		else animation = null;
	}

	ctx.clearRect(0,0,w,h);

	ctx.strokeStyle = "#000";
	ctx.strokeRect(1,1,s * 5 - 2,s * 6 - 2);
	ctx.strokeRect(s/2,s/2,s * 4,s * 5);
	ctx.strokeRect(s * 1.5, s * 5.5, s * 2, s * .5 - 1);
	ctx.clearRect(s * 1.5 + 1, s * 5.5 - 1, s * 2 - 2, s * .5 + 2)

	for(let piece of g.pieces){
		const {x, y, constructor:{dimensions:[dx,dy]}} = piece;
		let px = x, py = y;
		
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

		if(animation && animation[1] == piece){
			px -= animation[0][0] * animation[2];
			py -= animation[0][1] * animation[2];
		}

		ctx.fillRect((px + .5) * s, (py + .5) * s, dx * s, dy * s);
	}
	for(let piece of g.pieces){
		const {x, y, constructor:{dimensions:[dx,dy]}} = piece;
		let px = x, py = y;
		if(animation && animation[1] == piece){
			px -= animation[0][0] * animation[2];
			py -= animation[0][1] * animation[2];
		}
		ctx.strokeRect((px + .5) * s, (py + .5) * s, dx * s, dy * s);
	}

	if(g.pieces[0].x == 1 && g.pieces[0].y == 3 && animation && animation[2] == 0){
		g.pieces[0].y += 3;
		animation = [[0, 1], g.pieces[0], 3];
	}
	if(g.pieces[0].x == 1 && g.pieces[0].y == 6 && animation && animation[2] == 0){
		requestAnimationFrame(winTick);
		return;
	}


	requestAnimationFrame(frame);
}

function winTick(){
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
		if(animation && animation[1] == piece){
			px -= animation[0][0] * animation[2];
			py -= animation[0][1] * animation[2];
		}
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
}

requestAnimationFrame(frame);