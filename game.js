const readline = require("readline-sync");
const colors = require("./colors");

let maze = [
  "|-------------------|",
  "|       |           |",
  "|          |        |",
  "|             |     |",
  "|             |     |",
  "|             E     |",
  "|-------------------|",
];
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

const checkNextField = (maze, row, col) => {
  if (maze[row][col] === "E") {
    gameOver = true;
    return true;
  }
  // move possible!
  if (maze[row][col] === " ") {
    maze[row][col] = "X";
    path.push([row, col]);
    return true;
  }
  // move not possible
  return false;
};

const move = (maze) => {
  // check next possible move (up, right, down, left)

  // right possible?
  if (checkNextField(maze, row, col + 1)) {
    col++;
  }
  // down possible?
  else if (checkNextField(maze, row + 1, col)) {
    row++;
  }
  // left possible?
  else if (checkNextField(maze, row, col - 1)) {
    col--;
  }
  // up possible?
  else if (checkNextField(maze, row - 1, col)) {
    row--;
  }
  if (gameOver) {
    printMaze(maze);
    console.log("YOU nailed it! You found the way to the exit!");
    if (debug) {
      console.log("Your path through maze:", path);
    }
  }
};

// print the rows of the maze
const printMaze = (maze) => {
  console.log(colors.FgMagenta);
  maze.forEach((row) => {
    // join all columns of the row together to a string
    console.log(row.join(" "));
  });
  console.log(colors.Reset);
};

// display maze
printMaze(maze);

do {
  // let user place player at position
  row = readline.questionInt(`Row pleeeeze: \n(Min: 1, Max: ${maze.length})`);

  col = readline.questionInt(
    `Column pleeeeze: \n(Min: 1, Max: ${maze[0].length})`
  );

  row = parseInt(row)
  col = parseInt(col)

  row--;
  col--;

  if(row < 0 || row >= maze.length || col < 0 || col >= maze[0].length ) {
    console.log("Position außerhalb von Board! Komm schon, so schwer?");
    continue;
  }

  // valid start position must be EMPTY
  if (maze[row][col] !== " ") {
    console.log("Diese Position geht doch nicht, Bro! Komm schon, so schwer?");
  }

  playerPlaced = true;

} while (playerPlaced === false);

console.log("Gute Wahl!");
console.log("Reihe: ", row, ",", "Spalte: ", col);
console.log("Jetzt geht's loooooos!");

maze[row][col] = "X";

printMaze(maze);

// now move forever to target until we found it...
do {
  move(maze);
} while (!gameOver);
