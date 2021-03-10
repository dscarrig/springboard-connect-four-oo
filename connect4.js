/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const player1ColorInput = document.querySelector('#player-1-color');
const player2ColorInput = document.querySelector('#player-2-color');

let gameStarted = false;
let theGame = null;

class Game {
  constructor(height, width, player1, player2){
    this.height = height;
    this.width = width;
    this.player1 = player1;
    this.player2 = player2;

    let root = document.documentElement;
    root.style.setProperty('--p1-color', this.player1.color);
    root.style.setProperty('--p2-color', this.player2.color);

    this.currPlayer = player1;
    this.board = [];

    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard(){
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard(){
    const htmlBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    
    const piece = document.createElement('div');
    piece.classList.add('piece');

    piece.classList.add(`p${this.currPlayer.index}`);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt){

    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.color;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    if(this.currPlayer.index === 1){
      this.currPlayer = this.player2;
    }
    else{
      this.currPlayer = this.player1;
    }
    
  }

  checkForWin() {
    function _win(cells, h, w, b, p) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < h &&
          x >= 0 &&
          x < w &&
          b[y][x] === p.color
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz, this.height, this.width, this.board, this.currPlayer) || 
        _win(vert, this.height, this.width, this.board, this.currPlayer) || 
        _win(diagDR, this.height, this.width, this.board, this.currPlayer) || 
        _win(diagDL, this.height, this.width, this.board, this.currPlayer)) {
          return true;
        }
      }
    }
  }

  resetGame(player1, player2){
    while(document.getElementById('board').lastChild){
      document.getElementById('board').removeChild(document.getElementById('board').lastChild);
    }

    this.player1 = player1;
    this.player2 = player2;

    let root = document.documentElement;
    root.style.setProperty('--p1-color', this.player1.color);
    root.style.setProperty('--p2-color', this.player2.color);

    this.board = [];
    this.makeHtmlBoard();
    this.makeBoard();
  }

}

// Player class, contains their color and index. Red and blue are default if nothing is entered
class Player{
  constructor(color, index){
    this.color = color;
    this.index = index;

    if(!color){
      if(this.index === 1){
        this.color = "red";
      }
      else{
        this.color = "blue";
      }
    }
  }
}

// start button event for starting or resetting
document.querySelector('#start').addEventListener('click', function(){
  let player1 = new Player(player1ColorInput.value, 1);
  let player2 = new Player(player2ColorInput.value, 2);

  if(gameStarted){
    player1 = new Player(player1ColorInput.value, 1);
    player2 = new Player(player2ColorInput.value, 2);
    theGame.resetGame(player1, player2);
  }
  else{
    gameStarted = true;
    theGame = new Game(6, 7, player1, player2); 
  }
  
})






