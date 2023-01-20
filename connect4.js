/** Connect Four
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Player{

  constructor(color,playerID){
    this.color = color;
    this.playerID = playerID;
  }
}

class Game {

  constructor(HEIGHT,WIDTH,p1,p2){
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.board = [];
    this.p1 = p1;
    this.p2 = p2;
  }
 
  gameStart(){
  const P1 = this.p1;
  const P2 = this.p2;
  let currPlayer = P1;
  const height = this.HEIGHT;
  const width = this.WIDTH;
  let board = this.board;


  function makeBoard() {
    for (let y = 0; y < height; y++) {
      board.push(Array.from({ length: width }));
    }
  }


  function makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', handleClick);

    for (let x = 0; x < width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    htmlBoard.append(top);

    // make main part of board
    for (let y = 0; y < height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }


  function findSpotForCol(x) {
    for (let y = height - 1; y >= 0; y--) {
      if (!board[y][x]) {
        return y;
      }
    }
    return null;
  }


  function placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${Number(currPlayer.playerID)}`);
    piece.style.top = -50 * (y + 2);
    piece.style.backgroundColor = currPlayer.color;

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }


  function endGame(msg) {
    alert(msg);
    const topRow = document.getElementById('column-top');
    topRow.removeEventListener('click', handleClick);
  }



  function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    board[y][x] = Number(currPlayer.playerID);
    placeInTable(y, x);
    
    // check for win
    if (checkForWin()) {
      return endGame(`Player ${Number(currPlayer.playerID)} won!`);
    }
    
    // check for tie
    if (board.every(row => row.every(cell => cell))) {
      return endGame('Tie!');
    }
      
    // switch players
    
    currPlayer = currPlayer === P1 ? P2 : P1;
    
  }


  function checkForWin() {
    function _win(cells) {

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < height &&
          x >= 0 &&
          x < width &&
          board[y][x] === Number(currPlayer.playerID)
      );
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }


  makeBoard();
  makeHtmlBoard();

  }

}



const gameForm = document.getElementById("gameForm");
gameForm.addEventListener("submit", function(event) {
  event.preventDefault();

const htmlBoard = document.getElementById('board');
let boardChild = htmlBoard.lastElementChild;
while (boardChild) {
  htmlBoard.removeChild(boardChild);
  boardChild = htmlBoard.lastElementChild;
}


const player1Color = document.getElementById("colorPlayer1").value;
const player2Color = document.getElementById("colorPlayer2").value;
const p1Id = document.getElementById("colorPlayer1").getAttribute("name");
const p2Id = document.getElementById("colorPlayer2").getAttribute("name");
  
player1 = new Player(player1Color,p1Id);
player2 = new Player(player2Color,p2Id);

main = new Game(6,7,player1,player2);
main.gameStart();



});


