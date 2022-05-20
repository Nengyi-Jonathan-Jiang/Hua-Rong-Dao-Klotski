class Level{
	constructor(name, layout, description){
		this.name = name;
		this.s = layout.trim().split('\n').map(i=>i.trim()).join('');
		this.difficulty = description.difficulty || "Unknown";
		this.moves = description.moves || "Unknown";
	}
	get description(){return `Difficulty: ${this.difficulty}\nMoves: ${this.moves}`}
	generate(el){
		while(el.children.length){
			el.removeChild(el.children[0]);
		}
		let pieces = [null];
		let x = 0, y = 0;
		for(let i = 0; i < 20; i++){
			x = i & 3, y = i >> 2;
			if("^<1@".indexOf(this.s[i]) == -1) continue;
			
			let d = document.createElement("div");
			d.className = {"^":"v","<":"h","1":"l","@":"s"}[this.s[i]] + "-piece";
			d.setAttribute("data-x",x);
			d.setAttribute("data-y",y);
			el.appendChild(d);
			d.setAttribute("data-index", pieces.length);
			switch(this.s[i]){
				case '^':
					pieces.push(new VerticalPiece(x, y, d));
					break;
				case '<':
					pieces.push(new HorizontalPiece(x, y, d));
					break;
				case '1':
					d.setAttribute("data-index", 0);
					pieces[0] = new LargePiece(x, y, d);
					break;
				case '@':
					pieces.push(new SmallPiece(x, y, d));
					break;
			}
		}
		return new Grid(pieces);
	}
}
