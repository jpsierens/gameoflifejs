# Game of Life in ES6

To play, first download the repository, then, in your terminal, run this command (assuming you have node installed): 

<code>npm install</code> 


After that, either use File Open (Ctrl+o or Cmd+o) and navigate to the directory in your browser, or start an http server by typing in, on the command line, any of these commands:

* `php -S localhost:3000`
* `python -m SimpleHTTPServer 3000`
* `npm run servephp`
* `npm run serve`

in which case you can go to localhost:3000 to play the game.

<b>Note</b>, in this version there are a few additions:
1. You can stop the game, freezing it at any point, to perhaps add or remove squares
2. You can save and load games (useful if you want to put in a Glider Gun for instance)

There is also one other change, this version uses webpack instead of gulp, for no reason other than I fancied trying it out.

## Game of Life rules
In case you don't know them, these are the rules the Game of Life follows:

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overcrowding.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


