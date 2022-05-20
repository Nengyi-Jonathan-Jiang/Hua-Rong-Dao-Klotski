// const LEVELS = [
// 	new Level("T1", `
// 		@12@
// 		@34@
// 		@@@@
// 		@@@@
// 		@__@
// 	`, {moves: 15, difficulty: "Tutorial"}),
// 	new Level("T2", `
// 		@12@
// 		^34^
// 		v@@v
// 		^@@^
// 		v__v
// 	`, {moves: 15, difficulty: "Tutorial"}),
//     new Level("巧过五关", `
// 		@12@
// 		@34@
// 		<><>
// 		<><>
// 		_<>_
// 	`, {moves: 25, difficulty: "Easy"}),
// 	new Level('一路顺风', `
// 		^12@
// 		v34@
// 		^<>^
// 		v@^v
// 		_@v_
// 	`, {moves: 32, difficulty: "Easy"}),
//     new Level("井底之蛙",`
// 		@<>@
// 		^12^
// 		v34v
// 		@<>@
// 		_<>_
// 	`, {moves: 59, difficulty: "Easy"}),
//     new Level("桃花园中",`
// 		@12@
// 		^23^
// 		v^^v
// 		@vv@
// 		_<>_
// 	`),
// 	new Level("横刀立马", `
// 		^12^
// 		v34v
// 		^<>^
// 		v@@v
// 		@__@
// 	`, {}),
// 	new Level("水泄不通",`
// 		^12@
// 		v34@
// 		<><>
// 		<><>
// 		@__@
// 	`, {}),
//     new Level("峰回路转",`
// 		@@@^
// 		12^v
// 		34v^
// 		_<>v
// 		_@<>
// 	`, {}),
// 	new Level("指挥若定",`
// 		^12^
// 		v34v
// 		@<>@
// 		^@@^
// 		v__v
// 	`),
// 	new Level("将拥曹营",`
// 		_12_
// 		^34^
// 		v^^v
// 		@vv@
// 		<>@@
// 	`),
// 	new Level("齐头并进",`
// 		^12^
// 		v34v
// 		@@@@
// 		^<>^
// 		v__v
// 	`),
// 	new Level("兵分三路",`
// 		@12@
// 		^34^
// 		v<>v
// 		^@@^
// 		v__v
// 	`),
// 	new Level("雨声淅沥",`
// 		^12@
// 		v34@
// 		^<>^
// 		v_^v
// 		@_v@
// 	`),
// 	new Level("左右布兵",`
// 		@12@
// 		@34@
// 		^^^^
// 		vvvv
// 		_<>_
// 	`),
// 	new Level("一路进军",`
// 		^12@
// 		v34@
// 		^^^@
// 		vvv@
// 		_<>_
// 	`),
// 	new Level("六将挡路",`
// 		12<>
// 		34<>
// 		@@__
// 		^^<>
// 		vv<>
// 	`, {difficulty: "Medium", moves: 29}),
// ]

const LEVELS = (`
	雄兵百万
	@@@@
	@12@
	@34@
	@@@@
	@__@
	Tutorial 8

	四将押曹
	@12@
	^34^
	v@@v
	^@@^
	v__v
	Tutorial 14

	横刀立马
	^12^
	v34v
	^<>^
	v@@v
	@__@
	Hard 81

	横竖皆将
	^12^
	v34v
	^<>@
	v<>@
	@__@
	Hard 81

	守口如瓶
	@12@
	^34^
	v^_v
	@v_@
	<><>
	Hard 99

	层层设防
	@12@
	^34^
	v<>v
	@<>@
	_<>_
	Crazy 120

	三军联防
	12^^
	34vv
	<><>
	@<>@
	@__@
	Intermediate 65

	堵塞要道
	@12@
	@34@
	^^<>
	vv<>
	_<>_
	Easy 40

	水泄不通
	@12@
	@34@
	<><>
	<><>
	@__@
	Hard 79
	`
	.trim()
	.split('\n\n')
	.map(i=>i.split('\n').map(j=>j.trim()))
	.map(i=>new Level(
		i[0],
		i.slice(1,6).join('\n'),
		{
			difficulty:i[6].split(' ')[0], 
			moves: +i[6].split(' ')[1]
		}
	))
);