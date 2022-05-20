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

	巧过五关
	@12@
	@34@
	<><>
	<><>
	_<>_
	Easy 34
	
	五将逼宫
	<><>
	^12^
	v34v
	@<>@
	@__@
	Easy 38

	一路顺风
	^12@
	v34@
	^<>^
	v@^v
	_@v_
	Easy 39

	堵塞要道
	@12@
	@34@
	^^<>
	vv<>
	_<>_
	Easy 40

	三军联防
	12^^
	34vv
	<><>
	@<>@
	@__@
	Medium 65

	井底之蛙
	@<>@
	^12^
	v34v
	@<>@
	_<>_
	Medium 66

	桃花园中
	@12@
	^34^
	v^^v
	@vv@
	_<>_
	Medium 70

	水泄不通
	^12@
	v34@
	<><>
	<><>
	@__@
	Medium 79

	插翅难飞
	^12@
	v34@
	<>@@
	^<>^
	v__v
	Hard 62

	横刀立马
	^12^
	v34v
	^<>^
	v@@v
	@__@
	Hard 81

	守口如瓶
	@12@
	^34^
	v^_v
	@v_@
	<><>
	Hard 99

	横马当关
	^12^
	v34v
	<><>
	@^ @
	@v @
	Hard 83

	层层设防
	@12@
	^34^
	v<>v
	@<>@
	_<>_
	Crazy 120

	峰回路转
	@@@^
	12^v
	34v^
	_<>v
	_@<>
	Crazy 138
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
