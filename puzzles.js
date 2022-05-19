class Level{
	constructor(name, layout){
		this.name = name;
		this.s = layout.trim().split('\n').map(i=>i.trim()).join('');
	}
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

const LEVELS = [
	new Level("Testing - 1", `
		@@@@
		@@@@
		@12@
		@34@
		@__@
	`),
	new Level("Testing - 2", `
		@@@@
		@@@@
		@@@@
		12_@
		34_@
	`),
	new Level("Tutorial - 1", `
		@12@
		@34@
		@@@@
		@@@@
		@__@
	`),
	new Level("Tutorial - 2", `
		@12@
		^34^
		v@@v
		^@@^
		v__v
	`),
    new Level("过五关", `
		@12@
		@34@
		<><>
		<><>
		_<>_
	`),
	new Level('一路顺风', `
		^12@
		v34@
		^<>^
		v@^v
		_@v_
	`),
    new Level("井底之蛙",`
		@<>@
		^12^
		v34v
		@<>@
		_<>_
	`),
    new Level("桃花园中",`
		@12@
		^23^
		v^^v
		@vv@
		_<>_
	`),
	new Level("横刀立马", `
		^12^
		v34v
		^<>^
		v@@v
		@__@
	`),
	new Level("水泄不通",`
		^12@
		v34@
		<><>
		<><>
		@__@
	`),
    new Level("峰回路转",`
		@@@^
		12^v
		34v^
		_<>v
		_@<>
	`),
	new Level("指挥若定",`
		^12^
		v34v
		@<>@
		^@@^
		v__v
	`),
	new Level("将拥曹营",`
		_12_
		^34^
		v^^v
		@vv@
		<>@@
	`),
	new Level("齐头并进",`
		^12^
		v34v
		@@@@
		^<>^
		v__v
	`),
	new Level("兵分三路",`
		@12@
		^34^
		v<>v
		^@@^
		v__v
	`),
	new Level("雨声淅沥",`
		^12@
		v34@
		^<>^
		v_^v
		@_v@
	`),
	new Level("左右布兵",`
		@12@
		@34@
		^^^^
		vvvv
		_<>_
	`),
	new Level("一路进军",`
		^12@
		v34@
		^^^@
		vvv@
		_<>_
	`),
]