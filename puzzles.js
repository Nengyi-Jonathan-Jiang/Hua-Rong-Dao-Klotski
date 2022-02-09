const LEVELS = [
    {
        name: "过五关",
        generate: _=>new Grid([        
            new LargePiece(1,0),

            new HorizontalPiece(0,2),
            new HorizontalPiece(2,2),
            new HorizontalPiece(0,3),
            new HorizontalPiece(2,3),
            new HorizontalPiece(1,4),

            new SmallPiece(0,0),
            new SmallPiece(0,1),
            new SmallPiece(3,0),
            new SmallPiece(3,1),
        ])
    },
    {
        name: "一路顺风",
        generate: _=>new Grid([        
            new LargePiece(1,0),
        
            new HorizontalPiece(1,2),
        
            new VerticalPiece(0,0),
            new VerticalPiece(0,2),
            new VerticalPiece(2,3),
            new VerticalPiece(3,2),
        
            new SmallPiece(3,0),
            new SmallPiece(3,1),
            new SmallPiece(1,3),
            new SmallPiece(1,4),
        ])
    },
    {
        name: "井底之蛙",
        generate: _=>new Grid([        
            new LargePiece(1,1),

            new HorizontalPiece(1,0),
            new HorizontalPiece(1,3),
            new HorizontalPiece(1,4),

            new VerticalPiece(0,1),
            new VerticalPiece(3,1),

            new SmallPiece(0,0),
            new SmallPiece(3,0),
            new SmallPiece(0,3),
            new SmallPiece(3,3),
        ])
    },
    {
        name: "桃花园中",
        generate: _=>new Grid([
            new LargePiece(1,0),

            new HorizontalPiece(1,4),

            new VerticalPiece(0,1),
            new VerticalPiece(1,2),
            new VerticalPiece(2,2),
            new VerticalPiece(3,1),

            new SmallPiece(0,0),
            new SmallPiece(3,0),
            new SmallPiece(0,3),
            new SmallPiece(3,3),
        ])
    },
    {
        name: "横刀立马",
        generate: _=>new Grid([
            new LargePiece(1,0),
        
            new HorizontalPiece(1,2),
        
            new VerticalPiece(0,0),
            new VerticalPiece(0,2),
            new VerticalPiece(3,0),
            new VerticalPiece(3,2),
        
            new SmallPiece(0,4),
            new SmallPiece(1,3),
            new SmallPiece(2,3),
            new SmallPiece(3,4),
        ])
    },
    {
        name: "水泄不通",
        generate: _=>new Grid([
            new LargePiece(1,0),
        
            new HorizontalPiece(0,2),
            new HorizontalPiece(2,2),
            new HorizontalPiece(0,3),
            new HorizontalPiece(2,3),

            new VerticalPiece(0,0),
        
            new SmallPiece(3,0),
            new SmallPiece(3,1),
            new SmallPiece(0,4),
            new SmallPiece(3,4),
        ])
    },
    {
        name: "峰回路转",
        generate: _=>new Grid([        
            new LargePiece(0,1),

            new HorizontalPiece(1,3),
            new HorizontalPiece(2,4),

            new VerticalPiece(2,1),
            new VerticalPiece(3,0),
            new VerticalPiece(3,2),

            new SmallPiece(0,0),
            new SmallPiece(1,0),
            new SmallPiece(2,0),
            new SmallPiece(1,4),
        ])
    },
]