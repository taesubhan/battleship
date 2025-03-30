import { Cell } from './cell.js';
import { Ship } from './ship.js';

// Return a nested array containing Cell objects, representing a 2-dimensional game board
function createBoard(size) {
    const board = new Array(size);
    for (let i = 0; i < size; i++) {
        board[i] = Array.from(new Array(size), () => Cell());
    }
    return board;
}

// Game board object that represents a 2-d board game of size n cells. Board stores information such as ships and attacks made
export function Gameboard(size) {
    const board = createBoard(size);
    const allShips = [];

    // Example of allShips array
    // const testAllShips = [
    //     {
    //         length: 3,
    //         orientation: 'horizontal',
    //         headX: 3,
    //         headY: 5,
    //         ship: Ship(),
    //         cells: [[0,1], [0,2], [0,3]],
    //     }
    // ]

    return {
        getSize() {
            return size;
        },
        
        // Displays a simplified version of the game board on the console
        showBoard() {
            const newBoard = [];
            for (const row of board) {
                const newRow = row.map((cell) => cell.hasShip() ? 'S' : 'E');
                newBoard.push(newRow);
            }
            return newBoard;
        },

        // Return the 2-d array representation of the game board
        getBoard() {
            return board;
        },

        // Return array of all ships on board
        getAllShips() {
            return allShips;
        },

        // Returns the number of ships existing in the board
        getShipCount() {
            return allShips.filter((elem) => elem).length;
        },

        // Returns the ship object given the ship ID
        getShip(id) {
            return allShips[id];
        },

        // Returns boolean on whether the x and y coordinates are within the game board boundary
        isCellInBounds(x,y) {
            return x < size && x >= 0 && y < size && y >= 0;
        },

        isShipInCell(x,y) {
            return board[y][x].hasShip();
        },

        // Given x and y coordinate of cell, throws errors if the location is not a legal move, e.g. out of bounds, ship exists
        checkBoardSpace(x,y) {
            if (!this.isCellInBounds(x,y)) throw new Error('Coordinate is out of game board\'s boundary');
            if (this.isShipInCell(x,y)) throw new Error('Another ship already occupies this coordinate' + ` (${x},${y})`);
        },

        // Checks whether an [x,y] coordinate is within the array argument
        isCoordinatesInArray(arr, coor) {
            for (let a of arr) {
                if (JSON.stringify(a) == JSON.stringify(coor)) return true;
            }
            return false;
        },

        // Based on the ship's head location and length and oriention, returns an array of cells that the ship resides in
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
                    return null;
                }
            }
            return cells;
        },

        isPlacementValid(cells, length) { // cells represent an array of Cell objects
            return Boolean(cells) && cells.length == length;
        },

        addShipToCells(cells, ship) {
            cells.forEach(([x, y]) => board[y][x].storeValue(ship));
        },

        removeShipFromCells(cells) {
            cells.forEach(([x, y]) => board[y][x].removeValue());
        },

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
