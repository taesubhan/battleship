import { displayAllGameboards, announceWinner, createCurrentPlayerDoneButton } from './screen-controller.js';
import { displayEndGameScreen } from './set-up-input.js';

// Enables the Opponent's (Computer) board to be clicked to trigger an attack on their board
export function makeComputerOpponentBoardClickable(gameObj) {
    const opponentBoardDOM = document.querySelector('.opponent-board');
    if (!opponentBoardDOM) return;
    makeBoardClickable(opponentBoardDOM, gameObj, attackComputer);
}

// Enables the Opponent's (Player) board to be clicked to trigger an attack on their board
export function makePlayerOpponentBoardClickable(gameObj) {
    const opponentBoardDOM = document.querySelector('.opponent-board');
    if (!opponentBoardDOM) return;
    makeBoardClickable(opponentBoardDOM, gameObj, attackOtherPlayer);
}

function endGame(gameObj) {
    announceWinner(gameObj);
    displayEndGameScreen();
}

// Adds 'click' listener to each cell in game board obj. Where if player clicks on a cell it will trigger an attack on the enemy board
function makeBoardClickable(gameboardObj, gameObj, makeMoveFunc) {
    const cells = gameboardObj.querySelectorAll('.board-cell');
    for (let cell of cells) {
        const x = parseInt(cell.getAttribute('x'));
        const y = parseInt(cell.getAttribute('y'));
        cell.addEventListener('click', () => {
            if (gameObj.isLegalMove(x,y)){
                makeMoveFunc(gameObj, x, y); 
            }
        })
    }
}

// Used in makeBoardClickable function
function attackComputer(gameObj, x, y) {
    attackOpponentBoard(gameObj, x, y);
    if (!gameObj.isGameOver()) computerMakesMove(gameObj);
}

// Used in makeBoardClickable function
function attackOtherPlayer(gameObj, x, y) {
    attackOpponentBoard(gameObj, x, y);
    if (!gameObj.isGameOver()) createCurrentPlayerDoneButton(gameObj, switchToOtherPlayer);
    // switchToOtherPlayer(gameObj);
}

function computerMakesMove(gameObj) {
    gameObj.switchPlayer();
    computerAttacksBoard(gameObj);
}

function switchToOtherPlayer(gameObj) {
    gameObj.switchPlayer();
    displayAllGameboards(gameObj);
    makePlayerOpponentBoardClickable(gameObj);
}

function attackOpponentBoard(gameObj, x, y) {
    gameObj.makeMove(x,y);
    const shipID = gameObj.getIDOfSunkenShipFromCoor(x, y);

    // Do something if a ship is sunk
    if (typeof shipID === 'number') {
    }

    displayAllGameboards(gameObj);

    // The player's move ends the game
    if (gameObj.isGameOver()) {
        endGame(gameObj);
        return;
    }
}

function computerAttacksBoard(gameObj) {
    gameObj.compMakeMove();

    if (gameObj.isGameOver()) {
        gameObj.switchPlayer();
        displayAllGameboards(gameObj);
        gameObj.switchPlayer();
        endGame(gameObj);
        return;
    }

    gameObj.switchPlayer();
    displayAllGameboards(gameObj);
    makeComputerOpponentBoardClickable(gameObj);
}