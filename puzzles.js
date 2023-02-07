const LEVELS = (`
	雄兵百万
	@@@@
	@12@
	@34@
	@@@@
	@__@
	Tutorial 8

	单将挡路
	@12@
	@34@
	@@@@
	@^_@
	@v_@
	Tutorial 16

	四将押曹
	@12@
	^34^
	v@@v
	^@@^
	v__v
	Tutorial 14

	一夫当关
	@@@@
	@@@@
	@@@@
	<>12
	__34
	Tutorial 25

	巧过五关
	@12@
	@34@
	<><>
	<><>
	_<>_
	Easy 25
	
	一路顺风
	^12@
	v34@
	^<>^
	v@^v
	_@v_
	Easy 32

	六将挡路
	12<>
	34<>
	@@__
	^^<>
	vv<>
	Medium 29
	
	堵塞要道
	@12@
	@34@
	^^<>
	vv<>
	_<>_
	Medium 31

	五将逼宫
	<><>
	^12^
	v34v
	@<>@
	@__@
	Easy 37
	
	三军联防
	12^^
	34vv
	<><>
	@<>@
	@__@
	Medium 52

	井底之蛙
	@<>@
	^12^
	v34v
	@<>@
	_<>_
	Medium 60

	桃花园中
	@12@
	^34^
	v^^v
	@vv@
	_<>_
	Medium 68

	插翅难飞
	^12@
	v34@
	<>@@
	^<>^
	v__v
	Hard 51

	水泄不通
	^12@
	v34@
	<><>
	<><>
	@__@
	Hard 74

	横刀立马
	^12^
	v34v
	^<>^
	v@@v
	@__@
	Hard 80

	横马当关
	^12^
	v34v
	<><>
	@^ @
	@v @
	Hard 83

	守口如瓶
	@12@
	^34^
	v^_v
	@v_@
	<><>
	Crazy 99

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
	.replace(/\n[ \t]+/g,"\n")
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
