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
	hasPiece(x, y){
		return x > 3 || x < 0 || y > 4 || y < 0 || this.grid[x][y] != null;
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
}

/** @abstract */
class Piece{
	/** @param {number} x @param {number} y */
	constructor(x, y, id){
		this.x = x;
		this.y = y;
		this.id = id;
	}

	/** @abstract @param {Grid} grid */
	place(grid){}

	moveL(){this.x--;return [[-1, 0], this, 1]}
	moveR(){this.x++;return [[ 1, 0], this, 1]}
	moveT(){this.y--;return [[0, -1], this, 1]}
	moveB(){this.y++;return [[0,  1], this, 1]}
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
		if(grid.hasPiece(this.x - 1, this.y)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x - 1, this.y, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(grid.hasPiece(this.x + 1, this.y)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(grid.hasPiece(this.x, this.y - 1)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(grid.hasPiece(this.x, this.y + 1)) return null;
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
		if(grid.hasPiece(this.x - 1, this.y)) return null;
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x - 1, this.y, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(grid.hasPiece(this.x + 2, this.y)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 2, this.y, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(grid.hasPiece(this.x, this.y - 1) || grid.hasPiece(this.x + 1, this.y - 1)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x, this.y - 1, this);
		grid.setPiece(this.x + 1, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(grid.hasPiece(this.x, this.y + 1) || grid.hasPiece(this.x + 1, this.y + 1)) return null;
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
		if(grid.hasPiece(this.x - 1, this.y) || grid.hasPiece(this.x - 1, this.y + 1)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x - 1, this.y, this);
		grid.setPiece(this.x - 1, this.y + 1, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(grid.hasPiece(this.x + 1, this.y) || grid.hasPiece(this.x + 1, this.y + 1)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x + 1, this.y, this);
		grid.setPiece(this.x + 1, this.y + 1, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(grid.hasPiece(this.x, this.y - 1)) return null;
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(grid.hasPiece(this.x, this.y + 2)) return null;
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
		if(grid.hasPiece(this.x - 1, this.y) || grid.hasPiece(this.x - 1, this.y + 1)) return null;
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x + 1, this.y + 1, null);
		grid.setPiece(this.x - 1, this.y, this);
		grid.setPiece(this.x - 1, this.y + 1, this);
		return super.moveL();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveR(grid){
		if(grid.hasPiece(this.x + 2, this.y) || grid.hasPiece(this.x + 2, this.y + 1)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x + 2, this.y, this);
		grid.setPiece(this.x + 2, this.y + 1, this);
		return super.moveR();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveT(grid){
		if(grid.hasPiece(this.x, this.y - 1) || grid.hasPiece(this.x + 1, this.y - 1)) return null;
		grid.setPiece(this.x, this.y + 1, null);
		grid.setPiece(this.x + 1, this.y + 1, null);
		grid.setPiece(this.x, this.y - 1, this);
		grid.setPiece(this.x + 1, this.y - 1, this);
		return super.moveT();
	}
	/** @override */
	/** @param {Grid} grid */ 
	moveB(grid){
		if(grid.hasPiece(this.x, this.y + 2) || grid.hasPiece(this.x + 1, this.y + 2)) return null;
		grid.setPiece(this.x, this.y, null);
		grid.setPiece(this.x + 1, this.y, null);
		grid.setPiece(this.x, this.y + 2, this);
		grid.setPiece(this.x + 1, this.y + 2, this);
		return super.moveB();
	}
}