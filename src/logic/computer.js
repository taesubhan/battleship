// Get random number between min and max (exclusive);
export function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function makeComputedAttackOnBoard(board) {
    let legalMove = false;
    while (!legalMove) {
        let x = getRandomNum(0, gameboardSize);
        let y = getRandomNum(0, gameboardSize);
        legalMove = board.isLegalAttack(x,y);
        if (legalMove) board.receiveAttack(x,y);
    }
}

export function Computer(playerBoard) {
    let hitQueue = [];
    let priorTarget = null;

    function attackBoard(x,y) {
        playerBoard.receiveAttack(x,y);
        priorTarget = [x,y];
        checkIfShipHit(x,y);
    }

    function didPriorTurnHit() {
        if (!priorTarget) return false;
        const [x,y] = priorTarget;

        return playerBoard.isShipInCell(x,y);
    }
    
    // Return either the left or right available (not already hit, within boundary) cell at random
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
        console.log('xAdj: ',xAdj);
        console.log('leftRight',x,y)
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

        console.log('adjCell: ',adjCell);
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

    function sumCell(cell1, cell2) {
        const [x1, y1] = cell1;
        const [x2, y2] = cell2;
        return [x2+x1, y2+y1];
    }

    function checkIfShipHit(x,y) {
        if (playerBoard.isShipInCell(x,y)) {
            hitQueue.push([x,y]);
            // If hit sunk ship
            if (playerBoard.doesHitSinkShip(x,y)) {
                const shipID = playerBoard.getShipIDFromXY(x,y);
                const shipCells = playerBoard.getShip(shipID).cells;
                console.log(shipCells);
                removeCellsFromQueue(shipCells);
            }
        } 
    }

    return {
        makeRandomAttack() {
            let legalMove = false;
            while (!legalMove) {
                let x = getRandomNum(0, playerBoard.getSize());
                let y = getRandomNum(0, playerBoard.getSize());
                legalMove = playerBoard.isLegalAttack(x,y);
                if (legalMove) {
                    attackBoard(x,y);
                    // if (playerBoard.isShipInCell(x,y)) hitQueue.push([x,y]);
                }
            }
        },

        makeComputedAttackOnBoard() {
            // Computer doesn't have a prior non-sunk hit to go off of, so it makes a random hit
            if (hitQueue.length == 0) {
                console.log('1');
                this.makeRandomAttack();

            // Computer hits a cell with a ship for the first time, so it randomly hits adjacent direction to guess the orientation of ship
            } else if (hitQueue.length == 1) {
                console.log('2');
                const [priorX, priorY] = hitQueue[0];
                const nextTargetCell = getRandomAvailableAdjCell(priorX, priorY);

                // No available cell is adjacent to the prior hit cell
                if (!nextTargetCell) {
                    hitQueue.shift();
                    console.log('ERROR 1');
                    // makeComputedAttackOnBoard();
                    return;
                }
                const [x,y] = nextTargetCell;
                console.log('2: ', x,y)
                attackBoard(x,y);

            // Computer has previously hit a ship twice or more (adjacently). It will start attacking in that direction
            } else if (hitQueue.length > 1 && didPriorTurnHit()) {
                console.log('3');
                const [priorX, priorY] = hitQueue[hitQueue.length - 1];
                const [firstX, firstY] = hitQueue[0];
                const cellDirection = getCellDirection([priorX, priorY], [firstX, firstY]);
                const nextCell = sumCell([priorX, priorY], cellDirection);
                const [x, y] = nextCell;
                console.log('direction: ', [x,y]);
                if (!playerBoard.isLegalAttack(x,y)) {
                    console.log('inside here');
                    priorTarget = null;
                    this.makeComputedAttackOnBoard();
                    return;
                }
                attackBoard(x,y);

            // Computer has consecutively hit a ship except for the last turn where it missed and ship is still not sunk
            } else if (hitQueue.length > 1 && !didPriorTurnHit()) {
                console.log('4');
                const [firstX, firstY] = hitQueue[0];
                const [priorX, priorY] = hitQueue[hitQueue.length - 1];

                let adjacentCell;

                if (Math.abs(firstX-priorX) > 0) {
                    console.log('LR')
                    adjacentCell = getAvailableLeftOrRightCell(firstX, firstY);
                    if (!adjacentCell) adjacentCell = getAvailableTopOrBottomCell(firstX, firstY);
                } else if (Math.abs(firstY-priorY) > 0) {
                    console.log('UPDOWN')
                    adjacentCell = getAvailableTopOrBottomCell(firstX, firstY);
                    if (!adjacentCell) adjacentCell = getAvailableLeftOrRightCell(firstX, firstY);
                }
                console.log('adjacent cell: ', adjacentCell);
                console.log('first: ', firstX, firstY);
                console.log('prior: ', priorX, priorY);

                if (!adjacentCell) {
                    
                }

                const [x, y] = adjacentCell;
                console.log('x,y: ', x,y);
                attackBoard(x,y);

            }
            console.log('hit queue: ', hitQueue);
            console.log('prior target: ', priorTarget);
            // LEFT OFF HERE: Figure out how to go from back to original space to other direction all the way through
            
        },
    }
}

// if second part of the ship was hit
// direction of where comp keeps hitting
// when the comp knows where to stop hitting a direction after missing