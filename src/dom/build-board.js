import { buildImgDOM, makeImgDOMMoveable } from './build-piece-img.js';
// import shipsJSON from './ships.json' with { type:'json' };
import dot from '../images/icons/dot.svg';
import battleShip1 from "../images/icons/battleship-piece-1.png";
import battleShip2 from "../images/icons/battleship-piece-2.png";
import battleShip3 from "../images/icons/battleship-piece-3.png";
import battleShip4 from "../images/icons/battleship-piece-4.png";
import battleShip5 from "../images/icons/battleship-piece-5.png";

const shipsImgStorage = [battleShip1, battleShip2, battleShip3, battleShip4, battleShip5]

// Create a DOM element that represents the game board
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

// Given the DOM game board, displays a specific ship on the DOM game board
function showShipOnDOMBoard(id, gameBoardDOM, gameboardShipObj) {
    const headX = gameboardShipObj.headX;
    const headY = gameboardShipObj.headY;
    const orientation = gameboardShipObj.orientation;

    const cellDOM = gameBoardDOM.querySelector(`li[x="${headX}"][y="${headY}"]`);
    const shipJSON = shipsshipsImgStoragegStorage[id];
    const shipImgDOM = buildImgDOM(id, shipJSON.link, shipJSON.length, orientation); //How to determine if it should be moveable or static
    cellDOM.appendChild(shipImgDOM);
}

// Displays the ships on the DOM game board if they have sunk
export function showAllSunkShipsOnDOMBoard(gameBoardDOM, gameBoardObj) {
    const ships = gameBoardObj.getAllShips();
    for (let id = 0; id < ships.length; id++) {
        let ship = ships[id];
        if (!ship) continue;
        if (!ship.ship.isSunk()) continue;

        showShipOnDOMBoard(id, gameBoardDOM, ship);
    }
}

// Displays all ships on the DOM game board
export function showAllShipsOnDOMBoard(gameBoardDOM, gameBoardObj) {
    const ships = gameBoardObj.getAllShips();
    for (let id = 0; id < ships.length; id++) {
        let ship = ships[id];
        if (!ship) continue;

        showShipOnDOMBoard(id, gameBoardDOM, ship);
    }
}

// Makes it so that the ships on the DOM game board can be dragged and moved
export function makeAllShipsOnDOMBoardMoveable(gameBoardDOM, gameBoardObj) {
    const shipsDOM = gameBoardDOM.querySelectorAll('.game-piece-img');
    shipsDOM.forEach((ship) => makeImgDOMMoveable(ship, gameBoardObj));
}

// Displays the hit marker on the DOM game board
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