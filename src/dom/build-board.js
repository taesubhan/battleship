import { buildImgDOM, makeImgDOMMoveable } from './build-piece-img.js';

import shipsJSON from './ships.json' with { type:'json' };
import dot from '../images/icons/dot.svg';

export function buildDOMBoard(gameBoardObj) {
    const board = gameBoardObj.getBoard();
    const boardContainer = document.createElement('ul');
    boardContainer.classList.add('game-board');
    
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const cellDOM = document.createElement('li');
            cellDOM.classList.add('board-cell');
            cellDOM.setAttribute('x', x);
            cellDOM.setAttribute('y', y);
            boardContainer.appendChild(cellDOM);
            }
    }

    return boardContainer;
}

function showShipOnDOMBoard(id, gameBoardDOM, gameboardShipObj) {
    const headX = gameboardShipObj.headX;
    const headY = gameboardShipObj.headY;
    const orientation = gameboardShipObj.orientation;

    const cellDOM = gameBoardDOM.querySelector(`li[x="${headX}"][y="${headY}"]`);
    const shipJSON = shipsJSON[id];
    const shipImgDOM = buildImgDOM(id, shipJSON.link, shipJSON.length, orientation); //How to determine if it should be moveable or static
    cellDOM.appendChild(shipImgDOM);
}

export function showAllSunkShipsOnDOMBoard(gameBoardDOM, gameBoardObj) {
    const ships = gameBoardObj.getAllShips();
    for (let id = 0; id < ships.length; id++) {
        let ship = ships[id];
        if (!ship) continue;
        if (!ship.ship.isSunk()) continue;

        showShipOnDOMBoard(id, gameBoardDOM, ship);
    }
}

export function showAllShipsOnDOMBoard(gameBoardDOM, gameBoardObj) {
    const ships = gameBoardObj.getAllShips();
    for (let id = 0; id < ships.length; id++) {
        let ship = ships[id];
        if (!ship) continue;

        showShipOnDOMBoard(id, gameBoardDOM, ship);
    }
}

export function makeAllShipsOnDOMBoardMoveable(gameBoardDOM, gameBoardObj) {
    const shipsDOM = gameBoardDOM.querySelectorAll('.game-piece-img');
    shipsDOM.forEach((ship) => makeImgDOMMoveable(ship, gameBoardObj));
}

export function showHitsOnDOMBoard(gameBoardDOM, gameBoardObj) {
    const board = gameBoardObj.getBoard();
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            const cell = board[y][x];
            if (!cell.hasBeenHit()) continue;

            const cellDOM = gameBoardDOM.querySelector(`li[x="${x}"][y="${y}"]`);
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