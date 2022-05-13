#include <vector>
#include <map>
#include <array>
#include <deque>

using std::vector;
using std::map;
using std::array;
using std::deque;
using std::pair;
using std::make_pair;

struct State{
    array<char, 20> grid {};
    
    State() = default;
    State(char* ptr){
      memcpy(&grid[0], (const void*)ptr, 20);
    }
    
    bool operator!=(const State& other) const {
      return grid != other.grid;
    }
    
    bool operator<(const State& other) const {
      return grid < other.grid;
    }
};

enum Direction{UP,DOWN,LEFT,RIGHT,NONE};

struct Move{
  char x, y;
  Direction d;
  
  Move(){}
  Move(int x, int y, Direction d) : x((char)x), y((char)y), d(d) {}
};

char getAt(const State& s, int x, int y){
    return s.grid[x + y * 4];
}
void setAt(State& s, int x, int y, char v){
    s.grid[x + y * 4] = v;
}


/** @param {State} mat @returns {[number, number, string][]} */
vector<Move> allowedMoves(const State& mat){
	vector<Move> res;
	
	for(char x = 0; x <= 3; x++) for(char y = 0; y <= 4; y++){
		if(getAt(mat, x, y) != '.') continue;

		if(y > 0 && (
			getAt(mat, x, y - 1) == '@'
			|| getAt(mat, x, y - 1) == 'v'
			|| (x < 3 && getAt(mat, x, y - 1) == '<' && getAt(mat, x + 1, y - 1) == '>' && getAt(mat, x + 1, y) == '.')
			|| (x < 3 && getAt(mat, x, y - 1) == '3' && getAt(mat, x + 1, y - 1) == '4' && getAt(mat, x + 1, y) == '.')
		)) res.push_back(Move(x, y - 1, DOWN));

		if(y < 4 && (
			getAt(mat, x, y + 1) == '@'
			|| getAt(mat, x, y + 1) == '^'
			|| (x < 3 && getAt(mat, x, y + 1) == '<' && getAt(mat, x + 1, y + 1) == '>' && getAt(mat, x + 1, y) == '.')
			|| (x < 3 && getAt(mat, x, y + 1) == '1' && getAt(mat, x + 1, y + 1) == '2' && getAt(mat, x + 1, y) == '.')
		)) res.push_back(Move(x, y + 1, UP));

		if(x > 0 && (
			getAt(mat, x - 1, y) == '@'
			|| getAt(mat, x - 1, y) == '>'
			|| (y < 4 && getAt(mat, x - 1, y) == '^' && getAt(mat, x - 1, y + 1) == 'v' && getAt(mat, x, y + 1) == '.')
			|| (y < 4 && getAt(mat, x - 1, y) == '2' && getAt(mat, x - 1, y + 1) == '4' && getAt(mat, x, y + 1) == '.')
		)) res.push_back(Move(x - 1, y, RIGHT));

		if(x < 3 && (
			getAt(mat, x + 1, y) == '@'
			|| getAt(mat, x + 1, y) == '<'
			|| (y < 4 && getAt(mat, x + 1, y) == '^' && getAt(mat, x + 1, y + 1) == 'v' && getAt(mat, x, y + 1) == '.')
			|| (y < 4 && getAt(mat, x + 1, y) == '1' && getAt(mat, x + 1, y + 1) == '3' && getAt(mat, x, y + 1) == '.')
		)) res.push_back(Move(x + 1, y, LEFT));
	}

	return res;
}

/** @param {state} mat @param {[number, number, string]} mv @returns {state}*/
State move(State mat, Move& mv){
  int x = mv.x, y = mv.y, direction = mv.d;
	switch(getAt(mat, x, y)){
		case '@':
			switch(direction){
				case UP:
					setAt(mat, x, y - 1, '@');
					setAt(mat, x, y, '.');
					break;
				case DOWN:
					setAt(mat, x, y + 1, '@');
					setAt(mat, x, y, '.');
					break;
				case LEFT:
					setAt(mat, x - 1, y, '@');
					setAt(mat, x, y, '.');
					break;
				case RIGHT:
					setAt(mat, x + 1, y, '@');
					setAt(mat, x, y, '.');
					break;
			}
			break;
		case '>':
			switch(direction){
				case RIGHT:
					setAt(mat, x + 1, y, '>');
					setAt(mat, x, y, '<');
					setAt(mat, x - 1, y, '.');
					break;
			}
			break;
		case '<':
			switch(direction){
				case UP:
					setAt(mat, x, y - 1, '<');
					setAt(mat, x + 1, y - 1, '>');
					setAt(mat, x, y, '.');
					setAt(mat, x + 1, y, '.');
					break;
				case DOWN:
					setAt(mat, x, y + 1, '<');
					setAt(mat, x + 1, y + 1, '>');
					setAt(mat, x, y, '.');
					setAt(mat, x + 1, y, '.');
					break;
				case LEFT:
					setAt(mat, x - 1, y, '<');
					setAt(mat, x, y, '>');
					setAt(mat, x + 1, y, '.');
					break;
			}
			break;
		case '^':
			switch(direction){
				case UP:
					setAt(mat, x, y - 1, '^');
					setAt(mat, x, y, 'v');
					setAt(mat, x, y + 1, '.');
					break;
				case LEFT:
					setAt(mat, x - 1, y, '^');
					setAt(mat, x - 1, y + 1, 'v');
					setAt(mat, x, y, '.');
					setAt(mat, x, y + 1, '.');
					break;
				case RIGHT:
					setAt(mat, x + 1, y, '^');
					setAt(mat, x + 1, y + 1, 'v');
					setAt(mat, x, y, '.');
					setAt(mat, x, y + 1, '.');
					break;
			}
			break;
		case 'v':
			switch(direction){
				case DOWN:
					setAt(mat, x, y + 1, 'v');
					setAt(mat, x, y, '^');
					setAt(mat, x, y - 1, '.');
					break;
			}
			break;
		
		case '1':
			switch(direction){
				case UP:
					setAt(mat, x, y - 1, '1');
					setAt(mat, x + 1, y - 1, '2');
					setAt(mat, x, y, '3');
					setAt(mat, x + 1, y, '4');
					setAt(mat, x, y + 1, '.');
					setAt(mat, x + 1, y + 1, '.');
					break;
				case LEFT:
					setAt(mat, x - 1, y, '1');
					setAt(mat, x - 1, y + 1, '3');
					setAt(mat, x, y, '2');
					setAt(mat, x, y + 1, '4');
					setAt(mat, x + 1, y, '.');
					setAt(mat, x + 1, y + 1, '.');
					break;
			}
			break;
		case '2':
			switch(direction){
				case RIGHT:
					setAt(mat, x + 1, y, '2');
					setAt(mat, x + 1, y + 1, '4');
					setAt(mat, x, y, '1');
					setAt(mat, x, y + 1, '3');
					setAt(mat, x - 1, y, '.');
					setAt(mat, x - 1, y + 1, '.');
					break;
			}
			break;
		case '3':
			switch(direction){
				case DOWN:
					setAt(mat, x, y + 1, '3');
					setAt(mat, x + 1, y + 1, '4');
					setAt(mat, x, y, '1');
					setAt(mat, x + 1, y, '2');
					setAt(mat, x, y - 1, '.');
					setAt(mat, x + 1, y - 1, '.');
					break;
			}
			break;
	}
	return mat;
}

/** @param {state} grid */
bool win(const State& grid){return getAt(grid, 1, 3) == '1';}

Move hint(const State& grid){
  
  if(win(grid)) return Move(-1,-1,NONE);
  
  map<State, pair<const State*, Move>> traversed {
    {grid, {nullptr, Move(-1,-1,NONE)}}
  };

  deque<const State*> q = {&grid};

	while(!q.empty()){
		const State* g = q.front(); q.pop_front();

		if(win(*g)){
			while(*traversed.at(*g).first != grid)
				g = traversed.at(*g).first;
			return traversed.at(*g).second;
		}
		
		vector<Move> moves = allowedMoves(*g);
		for(Move& mv : moves){
			State g2 = move(*g, mv);
			if(traversed.find(g2) != traversed.end()) continue;
			q.push_back(&traversed.emplace(g2, make_pair(g, mv)).first->first);
		}
	}
	throw "PUZZLE IS UNSOLVABLE!";
}

int getHint(char* in, char* out){
  State s(in);
  
  Move m = hint(s);
  
  memcpy(out, &m, 6);
  
  return 0;
}