import { makePieceDraggable, makePieceClickable} from './dragging-pieces.js';

import shipsJSON from './ships.json' with { type:'json' };


// Builds all game pieces on the side of board for player to drag onto game board
export function buildGamePiecesImgContainer(gameboardObj) {
    const container = document.createElement('div');
    container.classList.add('game-pieces-container');

    for (let i = 0; i < shipsJSON.length; i++) {
        const imgObj = shipsJSON[i];

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('game-piece');

        const img = buildImgDOM(i, imgObj.link, imgObj.length, 'horizontal', true, gameboardObj);
        imgDiv.appendChild(img);

        container.appendChild(imgDiv);
    }

    return container;
}

export function removeGamePiecesImgContainer() {
    const gamePieceContainer = document.querySelector('.game-pieces-container');
    if (gamePieceContainer) gamePieceContainer.remove();
}

// Creates an IMG element representing a single game piece (ship)
export function buildImgDOM(id, link, length, orientation = 'horizontal', draggable = false, gameboardObj) {
    const img = new Image(); //document.createElement('img');
        img.src = link;
        img.alt = `game piece ${id + 1}`;
        img.classList.add('game-piece-img');
        img.id = `piece-${id + 1}`;
        img.setAttribute('orientation', orientation);
        img.setAttribute('shipID', id);
        img.setAttribute('length', length);
        img.style.zIndex = 1;

        if (draggable) {
            img.draggable = true;
            makePieceDraggable(img);
            makePieceClickable(img, length, id, gameboardObj);
        }
        return img;
}