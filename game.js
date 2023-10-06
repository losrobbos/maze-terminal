const readline = require("readline-sync");
const colors = require("./colors");

let maze = [
  "|-------------------|",
  "|        |          |",
  "|          |        |",
  "|             |     |",
  "|                |  |",
  "|                E  |",
  "|-------------------|",
];

// load your custom maze from file (if exists)
try {
  maze = require("./maze.js");
}
catch(err) {
  // no custom maze found. no prob. just keep default above. do nothing
}


let row, col;
let playerPlaced = false;
let gameOver = false;

// set this to true, in order to show path through the maze at the end
let debug = false;

// convert strings to array => so we get a 2dim array where we easily can mark fields
maze = maze.map((row) => {
  return row.split("");
});

// move to next possible position (up, right, down, left)
let path = []; // breadcrumb: { row: 3, col: 3 }, { row: 2, col: 3 }, { row: 2, col: 4 }

const moves = [
  [0,1], // right (=> 0 row move, 1 col move right)
  [1,0], // down (=> 1 row move down, 0 col move)
  [0, -1], // left (=> 0 row move, 1 col move left)
  [-1, 0] // up (=> 1 row move up, 0 col move)
]

// print the rows of the maze
const printMaze = (maze) => {
  // console.log(colors.FgMagenta);  
  maze.forEach((row) => {
    // join all columns of the row together to a string
    row.forEach(col => {
      // show player moves in yellow. everything else purple
      process.stdout.write(col === "X" ? colors.FgYellow : colors.FgMagenta)
      process.stdout.write(col) // print symbol
    })
    console.log() // newline after each row
  });
  console.log(colors.Reset);
};

/**
 * Checks if given row, col is not occupied
 */
const checkNextField = (maze, row, col) => {
  if (maze[row][col] === "E") {
    gameOver = true;
    return true;
  }
  // move possible!
  if (maze[row][col] === " ") {
    return true;
  }
  // move not possible
  return false;
};

/**
 * Check next possible move
 * If possible: mark field on board and descend down
 * If not possible: check next move option
 * If NO move possible from list: UNDO last operation and return back one level
 */
const move = (maze, row, col) => {

  // check next possible move one after the other (up, right, down, left)
  for(let [rowDiff, colDiff] of moves) {
    let rowNext = row+rowDiff
    let colNext = col+colDiff

    // check if move possible (= field not occupied already)
    if (checkNextField(maze, rowNext, colNext)) {
      // reached the end? finish!!!
      if(gameOver) break;

      // not at the end => mark current path and go on...
      maze[rowNext][colNext] = "X";
      path.push([rowNext, colNext]);
      move(maze, rowNext, colNext)
    }
  }

  if (gameOver) {
    printMaze(maze);
    console.log("YOU nailed it! You found the way to the exit!");
    if (debug) {
      console.log("Your path through maze:", path);
    }
    return true
  }

  // no possible move anymore?? undo last move!
  maze[row][col] = " "
  path.pop()
  return false
};

// display initial maze
printMaze(maze);

do {
  // let user place player at position
  row = readline.questionInt(`Row pleeeeze\n(Min: 2, Max: ${maze.length-1}): `);

  col = readline.questionInt(
    `Column pleeeeze\n(Min: 2, Max: ${maze[0].length-1}): `
  );

  row = parseInt(row)
  col = parseInt(col)

  row--;
  col--;

  if(row < 1 || row >= maze.length-1 || col < 1 || col >= maze[0].length-1 ) {
    console.log("Position außerhalb von Board! Komm schon, so schwer?");
    continue;
  }

  // valid start position must be EMPTY
  if (maze[row][col] !== " ") {
    console.log("Diese Position geht doch nicht, Bro! Komm schon, so schwer?");
  }

  playerPlaced = true;

} while (playerPlaced === false);

console.log()
console.log("Gute Wahl!");
console.log();
console.log("Jetzt geht's loooooos!");

// mark start position
maze[row][col] = "S";

printMaze(maze);

// now move recursively until we found a way...
move(maze, row, col);

// no way found at the end?
if(!gameOver) {
  console.error("NO way found :-O")
}
