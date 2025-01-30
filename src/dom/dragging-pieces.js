let draggedImg;
let adjX;
let adjY;
let hoveredCells;

function dragStart(ev) {
    const imgWidth = parseFloat(window.getComputedStyle(ev.target).getPropertyValue('width'));
    const imgHeight = parseFloat(window.getComputedStyle(ev.target).getPropertyValue('height'));

    const length = parseInt(ev.target.getAttribute('length'));

    adjX = Math.floor(ev.offsetX / (imgWidth/length));
    adjY = Math.floor(ev.offsetY / (imgHeight/1))

    ev.dataTransfer.setData('text/plain', JSON.stringify({
        id: ev.target.id,
        space: length,
        offsetX: Math.floor(ev.offsetX / (imgWidth/length)),
        offsetY: Math.floor(ev.offsetY / (imgHeight/1)),
    }));

    ev.target.style.opacity = '0';
    draggedImg = ev.target;
}

function addHoverClass(cellList, className) {
    for (let [x,y] of cellList) {
        const cellDOM = document.querySelector(`li[x='${x}'][y='${y}']`);
        cellDOM.classList.add(className);
    }
}

function removeHoverClass(cellList) {
    if (!cellList) return;
    for (let [x,y] of cellList) {
        const cellDOM = document.querySelector(`li[x='${x}'][y='${y}']`);
        cellDOM.classList.remove('hovered-valid');
    }
}

function dragOver(ev, gameObj) {
    ev.preventDefault();

    if (!draggedImg) return;
    const playerBoard = gameObj.getCurrentPlayerBoard();

    let cell;
    if (ev.target.classList.contains('game-piece-img') && ev.target.id == draggedImg.id) {
        ev.target.style.zIndex = '0';
        cell = ev.target.closest('.board-cell');
    } else {
        cell = ev.target;
    }

    const len = parseInt(draggedImg.getAttribute('length'));
    const headX = parseInt(cell.getAttribute('x')) - adjX;
    const headY = parseInt(cell.getAttribute('y')) - adjY;
    const ori = draggedImg.getAttribute('orientation');
    const shipID = parseInt(draggedImg.getAttribute('shipID'));
    const currentShip = playerBoard.getShip(shipID);
    const currentShipLocation = currentShip ? currentShip.cells : [];
    const cellList = playerBoard.getShipPlacement(len, headX, headY, ori, currentShipLocation);

    hoveredCells = cellList;
    ev.dataTransfer.dropEffect = 'move';

    if (cellList === null || cellList.length < len) {
        return;
    } else {
        addHoverClass(cellList, 'hovered-valid');
    }
}

function dragLeave(ev) {
    removeHoverClass(hoveredCells);
}

function makeImgVisible(img) {
    img.style.zIndex = '2';
    img.style.opacity = '1';
}

function dragEnd(ev) {
    const img = ev.target;
    makeImgVisible(img);
}

function changeShipOrientation(imgDOM, len, shipID, gameboardObj) {

    const ship = gameboardObj.getShip(shipID);
    if (!ship) return; // Ship is not in game board obj

    const orientation = ship.orientation;
    const newOrientation = orientation == 'horizontal' ? 'vertical' : 'horizontal';
    const headX = ship.headX;
    const headY = ship.headY;

    const targetedCells = gameboardObj.getShipPlacement(len, headX, headY, newOrientation, [[headX, headY]]);

    if (!targetedCells || targetedCells.length < len) {
        return;
    } else {
        gameboardObj.placeShip(len, headX, headY, newOrientation, shipID);
        imgDOM.setAttribute('orientation', `${newOrientation}`);
    }

}

function drop(ev, gameObj) {
    ev.preventDefault();

    if (!draggedImg) return;
    const data = JSON.parse(ev.dataTransfer.getData('text/plain'));
    const cell = ev.target.closest('.board-cell');
    const headX = parseInt(cell.getAttribute('x')) - data.offsetX;
    const headY = parseInt(cell.getAttribute('y')) - data.offsetY;
    const headCell = document.querySelector(`[x = "${headX}"][y = "${headY}"]`);

    const img = document.getElementById(data.id);
    const len = parseInt(img.getAttribute('length'));
    const ori = img.getAttribute('orientation');
    const shipID = parseInt(img.getAttribute('shipID'));

    if (!hoveredCells || hoveredCells.length < len) {
        makeImgVisible(img);
        return;
    } else {
        gameObj.placePlayerShip(len, headX, headY, ori, shipID);
        headCell.appendChild(img);
    }

    removeHoverClass(hoveredCells);
    resetStoredInfo();
}

function resetStoredInfo() {
    draggedImg = null;
    adjX = null;
    adjY = null;
    hoveredCells = null;
}

// Takes gameboard object and game object to make so that the game pieces can be dropped onto the cells of the game board
export function makeCellsDroppable(gameboardDOM, gameObj) {
    const cells = gameboardDOM.querySelectorAll('.board-cell');
    for (let cell of cells) {
        cell.addEventListener('dragover', (ev) => {
            dragOver(ev, gameObj);
        });
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('dragend', dragEnd);
        cell.addEventListener('drop', (ev) => {
            drop(ev, gameObj);
        });
    }

    document.addEventListener('dragend', dragEnd);
}

// Makes game image DOM piece draggable
export function makePieceDraggable(imgDOM) {
    imgDOM.addEventListener('dragstart', dragStart);
}

export function makePieceClickable(imgDOM, len, shipID, gameboardObj) {
    imgDOM.addEventListener('click', (e) => changeShipOrientation(imgDOM, len, shipID, gameboardObj));
}