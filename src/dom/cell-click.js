import { displayAllGameboards, endGame } from './screen-controller.js';

// Adds 'click' listener to each cell in game board obj. Where if player clicks on a cell it will trigger an attack on the enemy board
export function addClickListener(gameboardObj, gameObj) {
    const cells = gameboardObj.querySelectorAll('.board-cell');
    for (let cell of cells) {
        const x = parseInt(cell.getAttribute('x'));
        const y = parseInt(cell.getAttribute('y'));
        cell.addEventListener('click', () => {
            playerMakeMoveOnClick(gameObj, x, y);
        })
    }
}

function playerMakeMoveOnClick(gameObj, x, y) {
    const isLegal = gameObj.isLegalMove(x,y);
    if (isLegal) {
        gameObj.makeMove(x,y);
        const shipID = gameObj.getIDOfSunkenShipFromCoor(x, y);
        // console.log(shipID);
        if (typeof shipID === 'number') {
            console.log('SHIP SUNK!!!!!!!');
            console.log(shipID);
        }

        displayAllGameboards(gameObj, false);
        if (gameObj.isGameOver()) {
            endGame(gameObj);
            return;
        }
        gameObj.switchPlayer();
        computerMakeMove(gameObj);
    } 
}

function computerMakeMove(gameObj) {
    gameObj.compMakeMove();

    if (gameObj.isGameOver()) {
        displayAllGameboards(gameObj, false);
        endGame(gameObj);
        return;
    }
    displayAllGameboards(gameObj, true);
    gameObj.switchPlayer();
}