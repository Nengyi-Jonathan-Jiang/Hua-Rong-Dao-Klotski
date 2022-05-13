var Solver = (function(){
	/** @typedef {string} state */

	//These dont care that much about performance

	/** @param {string} str */
	function fromString(str){return str.trim().split('\n').join('')}
	/** @param {string[][]} mat */
	function fromMat(mat){return mat.map(i=>i.join('')).join('')}


	/** @param {state} mat @param {number} x @param {number} y */
	function getAt(mat,x, y){
		return mat[x + y * 4]
	}
	/** @param {state} mat @param {number} x @param {number} y @param {string} c */
	function setAt(mat,x, y, c){
		let i = x + y * 4;
		return mat.substring(0,i)
			+ c
			+ mat.substring(i+1)
	}

	/** @param {state} mat @returns {[number, number, string][]} */
	function allowedMoves(mat){
		let res = [];
		for(let x = 0; x <= 3; x++) for(let y = 0; y <= 4; y++){
			if(getAt(mat, x, y) != '.') continue;

			if(y > 0 && (
				getAt(mat, x, y - 1) == '@'
				|| getAt(mat, x, y - 1) == 'v'
				|| x < 3 && getAt(mat, x, y - 1) == '<' && getAt(mat, x + 1, y - 1) == '>' && getAt(mat, x + 1, y) == '.'
				|| x < 3 && getAt(mat, x, y - 1) + getAt(mat, x + 1, y - 1) == '34' && getAt(mat, x + 1, y) == '.'
			)) res.push([x, y - 1, "DOWN"]);

			if(y < 4 && (
				getAt(mat, x, y + 1) == '@'
				|| getAt(mat, x, y + 1) == '^'
				|| x < 3 && getAt(mat, x, y + 1) == '<' && getAt(mat, x + 1, y + 1) == '>' && getAt(mat, x + 1, y) == '.'
				|| x < 3 && getAt(mat, x, y + 1) + getAt(mat, x + 1, y + 1) == '12' && getAt(mat, x + 1, y) == '.'
			)) res.push([x, y + 1, "UP"]);

			if(x > 0 && (
				getAt(mat, x - 1, y) == '@'
				|| getAt(mat, x - 1, y) == '>'
				|| y < 4 && getAt(mat, x - 1, y) == '^' && getAt(mat, x - 1, y + 1) == 'v' && getAt(mat, x, y + 1) == '.'
				|| y < 4 && getAt(mat, x - 1, y) + getAt(mat, x - 1, y + 1) == '24' && getAt(mat, x, y + 1) == '.'
			)) res.push([x - 1, y, "RIGHT"]);

			if(x < 3 && (
				getAt(mat, x + 1, y) == '@'
				|| getAt(mat, x + 1, y) == '<'
				|| y < 4 && getAt(mat, x + 1, y) == '^' && getAt(mat, x + 1, y + 1) == 'v' && getAt(mat, x, y + 1) == '.'
				|| y < 4 && getAt(mat, x + 1, y) + getAt(mat, x + 1, y + 1) == '13' && getAt(mat, x, y + 1) == '.'
			)) res.push([x + 1, y, "LEFT"]);
		}

		return res;
	}
	/** @param {state} mat @param {[number, number, string]} mv @returns {state}*/
	function move(mat, mv){
		let [x, y, direction] = mv;
		switch(getAt(mat, x, y)){
			case '@':
				switch(direction){
					case 'UP':
						mat = setAt(mat, x, y - 1, '@');
						mat = setAt(mat, x, y, '.');
						break;
					case 'DOWN':
						mat = setAt(mat, x, y + 1, '@');
						mat = setAt(mat, x, y, '.');
						break;
					case 'LEFT':
						mat = setAt(mat, x - 1, y, '@');
						mat = setAt(mat, x, y, '.');
						break;
					case 'RIGHT':
						mat = setAt(mat, x + 1, y, '@');
						mat = setAt(mat, x, y, '.');
						break;
				}
				break;
			case '>':
				switch(direction){
					case 'RIGHT':
						mat = setAt(mat, x + 1, y, '>');
						mat = setAt(mat, x, y, '<');
						mat = setAt(mat, x - 1, y, '.');
						break;
				}
				break;
			case '<':
				switch(direction){
					case 'UP':
						mat = setAt(mat, x, y - 1, '<');
						mat = setAt(mat, x + 1, y - 1, '>');
						mat = setAt(mat, x, y, '.');
						mat = setAt(mat, x + 1, y, '.');
						break;
					case 'DOWN':
						mat = setAt(mat, x, y + 1, '<');
						mat = setAt(mat, x + 1, y + 1, '>');
						mat = setAt(mat, x, y, '.');
						mat = setAt(mat, x + 1, y, '.');
						break;
					case 'LEFT':
						mat = setAt(mat, x - 1, y, '<');
						mat = setAt(mat, x, y, '>');
						mat = setAt(mat, x + 1, y, '.');
						break;
				}
				break;
			case '^':
				switch(direction){
					case 'UP':
						mat = setAt(mat, x, y - 1, '^');
						mat = setAt(mat, x, y, 'v');
						mat = setAt(mat, x, y + 1, '.');
						break;
					case 'LEFT':
						mat = setAt(mat, x - 1, y, '^');
						mat = setAt(mat, x - 1, y + 1, 'v');
						mat = setAt(mat, x, y, '.');
						mat = setAt(mat, x, y + 1, '.');
						break;
					case 'RIGHT':
						mat = setAt(mat, x + 1, y, '^');
						mat = setAt(mat, x + 1, y + 1, 'v');
						mat = setAt(mat, x, y, '.');
						mat = setAt(mat, x, y + 1, '.');
						break;
				}
				break;
			case 'v':
				switch(direction){
					case 'DOWN':
						mat = setAt(mat, x, y + 1, 'v');
						mat = setAt(mat, x, y, '^');
						mat = setAt(mat, x, y - 1, '.');
						break;
				}
				break;
			
			case "1":
				switch(direction){
					case "UP":
						mat = setAt(mat, x, y - 1, '1');
						mat = setAt(mat, x + 1, y - 1, '2');
						mat = setAt(mat, x, y, '3');
						mat = setAt(mat, x + 1, y, '4');
						mat = setAt(mat, x, y + 1, '.');
						mat = setAt(mat, x + 1, y + 1, '.');
						break;
					case "LEFT":
						mat = setAt(mat, x - 1, y, '1');
						mat = setAt(mat, x - 1, y + 1, '3');
						mat = setAt(mat, x, y, '2');
						mat = setAt(mat, x, y + 1, '4');
						mat = setAt(mat, x + 1, y, '.');
						mat = setAt(mat, x + 1, y + 1, '.');
						break;
				}
				break;
			case "2":
				switch(direction){
					case "RIGHT":
						mat = setAt(mat, x + 1, y, '2');
						mat = setAt(mat, x + 1, y + 1, '4');
						mat = setAt(mat, x, y, '1');
						mat = setAt(mat, x, y + 1, '3');
						mat = setAt(mat, x - 1, y, '.');
						mat = setAt(mat, x - 1, y + 1, '.');
						break;
				}
				break;
			case "3":
				switch(direction){
					case "DOWN":
						mat = setAt(mat, x, y + 1, '3');
						mat = setAt(mat, x + 1, y + 1, '4');
						mat = setAt(mat, x, y, '1');
						mat = setAt(mat, x + 1, y, '2');
						mat = setAt(mat, x, y - 1, '.');
						mat = setAt(mat, x + 1, y - 1, '.');
						break;
				}
				break;
		}
		return mat;
	}

	/** @param {state} grid */
	function win(grid){return grid[13] == '1'}

	/** @param {state} grid */
	function hint(grid){
		if(win(grid)) return null;

		/** @type {Map<state, [state, [number, number, string]]>} */
		let traversed = new Map([[grid, ["", [-1,-1,"NONE"]]]]);
		let q = [grid];

		while(q.length != 0){
			let g = q.shift();

			if(win(g)){
				while(traversed.get(g)[0] != grid)
					g = traversed.get(g)[0];
				return traversed.get(g)[1];
			}
			let moves = allowedMoves(g);
			for(let mv of moves){
				let g2 = move(g, mv);
				if(traversed.has(g2)) continue;
				traversed.set(g2, [g, mv]);
				q.push(g2);
			}
		}
		throw new Error("PUZZLE IS UNSOLVABLE!");
	}

	/** @param {state} grid */
	function hintAsync(grid){
		let stop = false;
		return {
			stop: _=>{stop = true},
			res: new Promise(resolve=>{
				if(win(grid) || stop) resolve(null);

				/** @type {Map<state, [state, [number, number, string]]>} */
				const traversed = new Map([[grid, ["", [-1,-1,"NONE"]]]]);
				const q = [grid];

				setTimeout(function f(){
					//Batch 100 steps at a time
					for(let i = 0; i < 1000; i++){
						if(q.length == 0 || stop) return resolve(null);

						let g = q.shift();
						// console.log(g);
						if(win(g)){
							// console.log("backtracking");
							while(traversed.get(g)[0] != grid)
								g = traversed.get(g)[0];
							return resolve(traversed.get(g)[1]);
						}
						let moves = allowedMoves(g);
						for(let mv of moves){
							let g2 = move(g, mv);
							if(traversed.has(g2)) continue;
							traversed.set(g2, [g, mv]);
							q.push(g2);
						}
					}
					setTimeout(f, 0);
				},0);
			})
		}
	}

	/** @param {state} grid */
	function getStepsToSolve(grid){
		if(win(grid)) return [];

		/** @type {Map<state, [string, [number, number, string]]>} */
		let traversed = new Map([[grid, ["", [-1,-1,"NONE"]]]]);
		let q = [grid];

		while(q.length != 0){
			let g = q.shift();

			if(win(g)){
				let steps = [];
				let g2;
				while((g2 = traversed.get(g))[0] != grid){
					g = g2[0];
					steps.unshift(g2[1]);
				}
				return steps;
			}
			let moves = allowedMoves(g);
			for(let mv of moves){
				let g2 = move(g, mv);
				if(traversed.has(g2))
					continue;
				traversed.set(g2, [g, mv]);
				q.push(g2);
			}
		}
		throw new Error("PUZZLE IS UNSOLVABLE!");
	}

	return {
		allowedMoves: allowedMoves,
		getHint : hint,
		solve : getStepsToSolve,
		getAt: getAt,
		setAt: setAt,
		fromMat: fromMat,
		fromString: fromString,
		isWon : win,
		hintAsync: hintAsync
	}
})()