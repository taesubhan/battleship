// Get random number between min and max (exclusive);
export function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Computer that plays against the player with some intelligence
export function Computer(playerBoard) {
    let hitQueue = [];
    let priorTarget = null;

    // Computer attacks player's board
    function attackBoard(x,y) {
        playerBoard.receiveAttack(x,y);
        priorTarget = [x,y];
        checkIfShipHit(x,y);
    }

    // Checks whether the computer's prior attack hit a ship
    function didPriorTurnHit() {
        if (!priorTarget) return false;
        const [x,y] = priorTarget;

        return playerBoard.isShipInCell(x,y);
    }
    
    // Return either the left or right, available (not already hit, within boundary) cell at random
    function getAvailableLeftOrRightCell(x,y) {
        const coinFlip = getRandomNum(0,2);
        let xAdj;
        if (coinFlip == 0) {
            xAdj = [1, -1];
        } else {
            xAdj = [-1, 1];
        }

        for (let num of xAdj) {
            if (playerBoard.isLegalAttack(x + num, y)) return [x + num, y];
        }

        return null;
    }

    // Return either the top or bottom available (not already hit, within boundary) cell at random
    function getAvailableTopOrBottomCell(x,y) {
        const coinFlip = getRandomNum(0,2);
        let yAdj;
        if (coinFlip == 0) {
            yAdj = [1, -1];
        } else {
            yAdj = [-1, 1];
        }

        for (let num of yAdj) {
            if (playerBoard.isLegalAttack(x, y + num)) return [x, y + num];
        }

        return null;
    }

    // Return any random, available, adjacent cell. If no available cell exists, return null
    function getRandomAvailableAdjCell(x,y) {
        const coinFlip = getRandomNum(0,2);
        let adjCell;

        if (coinFlip == 0) {
            let aCell = getAvailableLeftOrRightCell(x,y);
            adjCell = aCell ? aCell : getAvailableTopOrBottomCell(x,y);
        } else if (coinFlip == 1) {
            let aCell = getAvailableTopOrBottomCell(x,y);
            adjCell = aCell ? aCell : getAvailableLeftOrRightCell(x,y);
        }

        return adjCell;
    }

    // Removes all cells from hitQueue that are in the array that's passed as an argument
    function removeCellsFromQueue(shipArr) {
        const filteredQueue = hitQueue.filter((cell) => {
            const [x,y] = cell;
            for (let c of shipArr) {
                const [shipX, shipY] = c;
                if (x == shipX && y == shipY) return false;
            }
            return true;
        })

        hitQueue = filteredQueue;
    }

    // Return the direction that cell2 is from cell1 in [x,y]. E.g. getCellDirection([1,1],[1,5]) => [0,5]
    function getCellDirection(cell1, cell2) {
        const [x1, y1] = cell1;
        const [x2, y2] = cell2;
        let xDir;
        let yDir;

        if (x1>x2) xDir = 1;
        else if (x1<x2) xDir = -1;
        else xDir = 0;

        if (y1>y2) yDir = 1;
        else if (y1<y2) yDir = -1;
        else yDir = 0;

        return [xDir, yDir];
    }

    // Returns the sum of X's and Y's respectively from cell1 and cell2
    function sumCell(cell1, cell2) {
        const [x1, y1] = cell1;
        const [x2, y2] = cell2;
        return [x2+x1, y2+y1];
    }

    // Based on the x,y target on opponent's board, it will add the cell in hitQueue if it hits a ship and remove all ship cells if it sunk that ship
    function checkIfShipHit(x,y) {
        if (playerBoard.isShipInCell(x,y)) {
            hitQueue.push([x,y]);
            // If hit sunk ship
            if (playerBoard.doesHitSinkShip(x,y)) {
                const shipID = playerBoard.getShipIDFromXY(x,y);
                const shipCells = playerBoard.getShip(shipID).cells;
                removeCellsFromQueue(shipCells);
            }
        } 
    }

    // Attacks anywhere on the board randomly
    function makeRandomAttack() {
        let legalMove = false;
        while (!legalMove) {
            let x = getRandomNum(0, playerBoard.getSize());
            let y = getRandomNum(0, playerBoard.getSize());
            legalMove = playerBoard.isLegalAttack(x,y);
            if (legalMove) {
                attackBoard(x,y);
            }
        }
    }

    // Randomly hits any adjacent cell from the first cell in the hitQueue array
    function hitRandomAdjacentCell() {
        const [priorX, priorY] = hitQueue[0];
        const nextTargetCell = getRandomAvailableAdjCell(priorX, priorY);

        // No available cell is adjacent to the prior hit cell
        if (!nextTargetCell) {
            hitQueue.shift();
            return;
        }
        const [x,y] = nextTargetCell;
        attackBoard(x,y);
    }

    // Continues to hit the cell in the direction from the prior hit to the first hit
    function hitCellInSingleDirection() {
        const [priorX, priorY] = hitQueue[hitQueue.length - 1];
        const [firstX, firstY] = hitQueue[0];
        const cellDirection = getCellDirection([priorX, priorY], [firstX, firstY]);
        const nextCell = sumCell([priorX, priorY], cellDirection);
        const [x, y] = nextCell;

        if (!playerBoard.isLegalAttack(x,y)) {
            priorTarget = null;
            hitRandomlyFromFirstSuccessfulHit()
            return;
        }
        attackBoard(x,y);
    }

    // Randomly hits a cell adjacent from the first successful hit 
    function hitRandomlyFromFirstSuccessfulHit() {
        const [firstX, firstY] = hitQueue[0];
        const [priorX, priorY] = hitQueue[hitQueue.length - 1];

        let adjacentCell;

        if (Math.abs(firstX-priorX) > 0) {
            adjacentCell = getAvailableLeftOrRightCell(firstX, firstY);
            if (!adjacentCell) adjacentCell = getAvailableTopOrBottomCell(firstX, firstY);
        } else if (Math.abs(firstY-priorY) > 0) {
            adjacentCell = getAvailableTopOrBottomCell(firstX, firstY);
            if (!adjacentCell) adjacentCell = getAvailableLeftOrRightCell(firstX, firstY);
        }

        const [x, y] = adjacentCell;
        attackBoard(x,y);
    }

    return {
        makeComputedAttackOnBoard() {
            // Computer doesn't have a prior non-sunk hit to go off of, so it makes a random hit
            if (hitQueue.length == 0) {
                makeRandomAttack();

            // Computer hits a cell with a ship for the first time, so it randomly hits adjacent direction to guess the orientation of ship
            } else if (hitQueue.length == 1) {
                hitRandomAdjacentCell();

            // Computer has previously hit a ship twice or more (adjacently). It will start attacking in that direction
            } else if (hitQueue.length > 1 && didPriorTurnHit()) {
                hitCellInSingleDirection();

            // Computer has consecutively hit a ship except for the last turn where it missed and ship is still not sunk
            } else if (hitQueue.length > 1 && !didPriorTurnHit()) {
                hitRandomlyFromFirstSuccessfulHit()
            }        
        },
    }
}
