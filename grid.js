class Grid{
	/** @param {Piece[]} pieces */
	constructor(pieces){
		/** @type {boolean[][]} */
		this.grid = new Array(4).fill([]).map(i=>new Array(5).fill(null));
		this.pieces = pieces;

		for(let piece of pieces) piece.place(this);
	}

	/** @param {number} x @param {number} y */
	getPiece(x, y){
		return (x > 3 || x < 0 || y > 4 || y < 0) ? null : this.grid[x][y];
	}

	/** @param {number} x @param {number} y */
	hasWall(x, y){
		return (x > 3 || x < 0 || y > 4 || y < 0);
	}

	/** @param {number} x @param {number} y */
	hasPiece(x, y){
		return !this.hasWall(x, y) && this.grid[x][y] != null;
	}

	/** @param {number} x @param {number} y */
	hasBlock(x, y){
		return this.hasWall(x, y) || this.grid[x][y] != null;
	}

	/** @param {number} x @param {number} y @param {Piece} piece*/
	setPiece(x, y, piece){
		this.grid[x][y] = piece;
	}

	moveL(x, y){
		if(this.getPiece(x,y) == null) return false;
		let piece = this.getPiece(x, y);
		return piece.moveL(this);
	}
	moveR(x, y){
		if(this.getPiece(x,y) == null) return false;
		let piece = this.getPiece(x, y);
		return piece.moveR(this);
	}
	moveT(x, y){
		if(this.getPiece(x,y) == null) return false;
		let piece = this.getPiece(x, y);
		return piece.moveT(this)
	}
	moveB(x, y){
		if(this.getPiece(x,y) == null) return false;
		let piece = this.getPiece(x, y);
		return piece.moveB(this);
	}

	toString(){
		let res = ".".repeat(20);
		for(let piece of this.pieces){
			let {x,y} = piece;
			switch(piece.constructor){
				case SmallPiece:
					res = Solver.setAt(res, x, y, '@');
					break;
				case HorizontalPiece:
					res = Solver.setAt(res, x, y, '<');
					res = Solver.setAt(res, x + 1, y, '>');
					break;
				case VerticalPiece:
					res = Solver.setAt(res, x, y, '^');
					res = Solver.setAt(res, x, y + 1, 'v');
					break;
				case LargePiece:
					res = Solver.setAt(res, x, y, '1');
					res = Solver.setAt(res, x + 1, y, '2');
					res = Solver.setAt(res, x, y + 1, '3');
					res = Solver.setAt(res, x + 1, y + 1, '4');
					break;
			}
		}
		return res;
	}
	fromString(){
		
	}

	get isAnimating(){
		return !this.pieces.every(i=>!i.isAnimating);
	}
}

/** @abstract */
class Piece{
	/** @param {number} x @param {number} y @param {HTMLElement} el*/
	constructor(x, y, el){
		this.el = el;
		this.px = this.x = x;
		this.py = this.y = y;
		this.isAnimating = false;
		this.el.ontransitionend = _=>{
			this.isAnimating = false;
		}
	}

	get x(){return +this.el.dataset.x}
	get y(){return +this.el.dataset.y}
	set x(v){this.el.dataset.x = v; this.isAnimating = true}
	set y(v){this.el.dataset.y = v; this.isAnimating = true}

	/** @abstract @param {Grid} grid */
	place(grid){}

	moveL(){this.px = this.x--; return true}
	moveR(){this.px = this.x++; return true}
	moveT(){this.py = this.y--; return true}
	moveB(){this.py = this.y++; return true}


	_check(grid, x, y, func){
		return !grid.hasWall(x, y) && (!grid.hasPiece(x, y) || grid.getPiece(x, y)[func](grid));
	}
	check(grid, func, ...positions){
		return positions.every(([x,y]) => this._check(grid, x, y, func));
	}
}

class SmallPiece extends Piece{
	static dimensions = [1, 1];
	/** @override */
	/** @param {Grid} grid */ 
	place(grid){
		grid.setPiece(this.x,this.y,this);
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveL(grid){
		if(!this.check(grid, "moveL", [this.x - 1, this.y])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x - 1, this.y, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(!this.check(grid, "moveR", [this.x + 1, this.y])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(!this.check(grid, "moveT", [this.x, this.y - 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(!this.check(grid, "moveB", [this.x, this.y + 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, this);
		return super.moveB();
	}
}

class HorizontalPiece extends Piece{
	static dimensions = [2, 1];
	/** @override */
	/** @param {Grid} grid */ 
	place(grid){
		grid.setPiece(this.x,this.y,this);
		grid.setPiece(this.x + 1,this.y,this);
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveL(grid){
		if(!this.check(grid, "moveL", [this.x - 1, this.y])) return false;
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x - 1, this.y, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(!this.check(grid, "moveR", [this.x + 2, this.y])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 2, this.y, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(!this.check(grid, "moveT", [this.x, this.y - 1], [this.x + 1, this.y - 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x, this.y - 1, this);
		grid.setPiece(this.x + 1, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(!this.check(grid, "moveB", [this.x, this.y + 1], [this.x + 1, this.y + 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x, this.y + 1, this);
		grid.setPiece(this.x + 1, this.y + 1, this);
		return super.moveB();
	}
}

class VerticalPiece extends Piece{
	static dimensions = [1, 2];
	/** @override */
	/** @param {Grid} grid */ 
	place(grid){
		grid.setPiece(this.x,this.y,this);
		grid.setPiece(this.x,this.y + 1,this);
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveL(grid){
		if(!this.check(grid, "moveL", [this.x - 1, this.y], [this.x - 1, this.y + 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x - 1, this.y, this);
		grid.setPiece(this.x - 1, this.y + 1, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(!this.check(grid, "moveR", [this.x + 1, this.y], [this.x + 1, this.y + 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x + 1, this.y, this);
		grid.setPiece(this.x + 1, this.y + 1, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(!this.check(grid, "moveT", [this.x, this.y - 1])) return false;
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(!this.check(grid, "moveB", [this.x, this.y + 2])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 2, this);
		return super.moveB();
	}
}

class LargePiece extends Piece{
	static dimensions = [2, 2];
	/** @override */
	/** @param {Grid} grid */ 
	place(grid){
		grid.setPiece(this.x,this.y,this);
		grid.setPiece(this.x,this.y + 1,this);
		grid.setPiece(this.x + 1,this.y,this);
		grid.setPiece(this.x + 1,this.y + 1,this);
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveL(grid){
		if(!this.check(grid, "moveL", [this.x - 1, this.y], [this.x - 1, this.y + 1])) return false;
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x + 1, this.y + 1, null);
		grid.setPiece(this.x - 1, this.y, this);
		grid.setPiece(this.x - 1, this.y + 1, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(!this.check(grid, "moveR", [this.x + 2, this.y], [this.x + 2, this.y + 1])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x + 2, this.y, this);
		grid.setPiece(this.x + 2, this.y + 1, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(!this.check(grid, "moveT", [this.x, this.y - 1], [this.x + 1, this.y - 1])) return false;
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x + 1, this.y + 1, null);
		grid.setPiece(this.x, this.y - 1, this);
		grid.setPiece(this.x + 1, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(!this.check(grid, "moveB", [this.x, this.y + 2], [this.x + 1, this.y + 2])) return false;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x, this.y + 2, this);
		grid.setPiece(this.x + 1, this.y + 2, this);
		return super.moveB();
	}
}