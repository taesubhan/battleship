import { buildImgDOM } from './build-piece-img.js';

import shipsJSON from './ships.json' with { type:'json' };
import dot from '../images/icons/dot.svg';

// Builds the DOM game board
export function buildBoard(gameBoardObj, showShip = false, showHit = true, piecesDraggable = false) {
    const board = gameBoardObj.getBoard();
    const boardContainer = document.createElement('ul');
    boardContainer.classList.add('game-board');

    const allShipsOnBoard = gameBoardObj.getAllShips();
    
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const cell = board[y][x];
            const cellDOM = document.createElement('li');
            cellDOM.classList.add('board-cell');
            cellDOM.setAttribute('x', x);
            cellDOM.setAttribute('y', y);
            boardContainer.appendChild(cellDOM);

            if (showShip) {
                if (cell.hasShip()) {
                    const shipID = getShipIndex(x, y, allShipsOnBoard);
                    if (shipID !== null) {
                        const shipJSON = shipsJSON[shipID];
                        const shipGameObj = allShipsOnBoard[shipID];
                        const shipImgDOM = buildImgDOM(shipID, shipJSON.link, shipJSON.length, shipGameObj.orientation, piecesDraggable, gameBoardObj);
                        cellDOM.appendChild(shipImgDOM);
                    }
                }
            }

            if (showHit) {
                if (!cell.hasBeenHit()) continue;

                const hitImg = new Image();
                hitImg.src = dot;
                hitImg.classList.add('dot-target-marker');

                if (cell.isShipHit()) {
                    cellDOM.classList.add('ship-hit');
                    hitImg.classList.add('hit-marker');

                } else if (cell.isHitButShipMissed()) {
                    cellDOM.classList.add('hit-with-no-ship');
                    hitImg.classList.add('miss-marker');
                }

                cellDOM.appendChild(hitImg);
            }
        }
    }

    return boardContainer;
}

// Takes in the x,y coordinates and gameboard's list of ships and returns the index of ship 
// where the head of the ship matches the x,y arguments if exists
function getShipIndex(x, y, shipList) {
    for (let i = 0; i < shipList.length; i++) {
        let ship = shipList[i];
        if (ship) {
            if (x == ship.headX && y == ship.headY) {
                return i
            } 
        }
    }
    
    return null;
}