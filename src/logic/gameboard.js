import { Cell } from './cell.js';
import { Ship } from './ship.js';

function createBoard(size) {
    const board = new Array(size);
    for (let i = 0; i < size; i++) {
        board[i] = Array.from(new Array(size), () => Cell());
    }
    return board;
}

export function Gameboard(size) {
    const board = createBoard(size);
    const allShips = [];

    // Template: Delete later
    const testAllShips = [
        {
            length: 3,
            orientation: 'horizontal',
            headX: 3,
            headY: 5,
            ship: Ship(),
            cells: [[0,1], [0,2], [0,3]],
        }
    ]
    ////

    return {
        getSize() {
            return size;
        },
        
        showBoard() {
            const newBoard = [];
            for (const row of board) {
                const newRow = row.map((cell) => cell.hasShip() ? 'S' : 'E');
                newBoard.push(newRow);
            }
            return newBoard;
        },

        getBoard() {
            return board;
        },

        getAllShips() {
            return allShips;
        },

        getShipCount() {
            return allShips.filter((elem) => elem).length;
        },

        getShip(id) {
            return allShips[id];
        },

        isCellInBounds(x,y) {
            return x < size && x >= 0 && y < size && y >= 0;
        },

        isShipInCell(x,y) {
            return board[y][x].hasShip();
        },

        checkBoardSpace(x,y) {
            if (!this.isCellInBounds(x,y)) throw new Error('Coordinate is out of game board\'s boundary');
            if (this.isShipInCell(x,y)) throw new Error('Another ship already occupies this coordinate' + ` (${x},${y})`);
        },

        isCoordinatesInArray(arr, coor) {
            for (let a of arr) {
                if (JSON.stringify(a) == JSON.stringify(coor)) return true;
            }
            return false;
        },

        getShipPlacement(len, xCoor, yCoor, orientation, exclusion = []) {
            const cells = [];
            for (let i = 0; i < len; i++) {
                let x = xCoor;
                let y = yCoor;
                if (orientation === 'vertical') y += i;
                if (orientation === 'horizontal') x += i;
                try {
                    if (!this.isCoordinatesInArray(exclusion, [x,y])) this.checkBoardSpace(x,y);
                    cells.push([x,y]);
                } catch(err) {
                    console.log(err);
                    return null;
                }
            }
            return cells;
        },

        // moveShip(len, ori, xDestination, yDestination) {
            
        // },

        isPlacementValid(cells, length) {
            return Boolean(cells) && cells.length == length;
        },

        addShipToCells(cells, ship) {
            cells.forEach(([x, y]) => board[y][x].storeValue(ship));
        },

        removeShipFromCells(cells) {
            cells.forEach(([x, y]) => board[y][x].removeValue());
        },

        // consider removing all properties from allShips except ship + cells

        //Need to fix this. The error is not moving through to Screen Controller for randomizer

        placeShip(length, headX, headY, orientation, id) {
            const targetShip = allShips[id];
            const currentCells = targetShip ? targetShip.cells : []
            const targetCells = this.getShipPlacement(length, headX, headY, orientation, currentCells);
            if (!targetShip) {
                // Add ship to cells for first time on board
                if (!this.isPlacementValid(targetCells, length)) return;
                const ship = Ship(length);
                this.addShipToCells(targetCells, ship);
                allShips[id] = {length, orientation, headX, headY, ship, cells: targetCells};
            } else {
                // Move ship from existing spot in board to a new spot
                if (!this.isPlacementValid(targetCells, length)) {
                    return null;
                } else {
                    this.removeShipFromCells(currentCells);
                    this.addShipToCells(targetCells, targetShip.ship);
                    allShips[id] = {length, orientation, headX, headY, ship: targetShip.ship, cells: targetCells};
                }
            }

            return targetCells;
        },

        isLegalAttack(x, y) {
            return this.isCellInBounds(x,y) && !board[y][x].hasBeenHit();
        },

        receiveAttack(x, y) {
            if (!this.isLegalAttack(x, y)) return;
            const cell = board[y][x];
            cell.hit();
        },

        doesHitSinkShip(x, y) {
            const cell = board[y][x];
            if (cell.isShipHit()) {
                const ship = cell.getValue();
                return ship.isSunk();
            }
            return false;
        },

        getShipIDFromXY(x, y) {
            for (let id = 0; id < allShips.length; id++) {
                let ship = allShips[id];
                if (!ship) return null;
                for (let [shipX,shipY] of ship.cells) {
                    if (x == shipX && y == shipY) return id;
                }
            }
            return null;
        },

        areAllShipsSunk() {
            for (const shipObj of allShips) {
                if (!!shipObj && !shipObj.ship.isSunk()) return false;
            }
            return true;
        }
    }
}
