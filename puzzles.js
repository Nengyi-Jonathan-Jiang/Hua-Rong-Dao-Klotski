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
	new Level("T1", `
		@12@
		@34@
		@@@@
		@@@@
		@__@
	`, {moves: 15, difficulty: "Tutorial"}),
	new Level("T2", `
		@12@
		^34^
		v@@v
		^@@^
		v__v
	`, {moves: 15, difficulty: "Tutorial"}),
    new Level("过五关", `
		@12@
		@34@
		<><>
		<><>
		_<>_
	`, {moves: 25, difficulty: "Easy"}),
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
	new Level("Puzzler",`
		12<>
		34<>
		@@__
		^^<>
		vv<>
	`, {
		difficulty: "Medium",
		moves: 29
	}),
]