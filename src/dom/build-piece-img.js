import { makePieceMoveable } from './moving-pieces.js';
import { removeAllChildren } from './dom-functions.js';
import battleShip1 from "../images/icons/battleship-piece-1.png";
import battleShip2 from "../images/icons/battleship-piece-2.png";
import battleShip3 from "../images/icons/battleship-piece-3.png";
import battleShip4 from "../images/icons/battleship-piece-4.png";
import battleShip5 from "../images/icons/battleship-piece-5.png";

const shipsImgStorage = [battleShip1, battleShip2, battleShip3, battleShip4, battleShip5]

// Builds all game pieces on the side of board for player to drag onto game board
export function buildGamePiecesImgContainer(gameboardObj) {
    const container = document.createElement('div');
    container.classList.add('game-pieces-container');

    for (let i = 0; i < shipsImgStorage.length; i++) {
        const imgObj = shipsImgStorage[i];

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('game-piece');

        const img = buildImgDOM(i, imgObj.link, imgObj.length, 'horizontal');
        makeImgDOMMoveable(img, gameboardObj);
        imgDiv.appendChild(img);

        container.appendChild(imgDiv);
    }

    return container;
}

// Removes the container that initially holds all the ship pieces (when the player first is prompted to place their ships on board)
export function removeGamePiecesImgContainer() {
    const gamePieceContainer = document.querySelector('.game-pieces-container');
    if (gamePieceContainer) gamePieceContainer.remove();
}

// Keeps the container, but just removes the ship images
export function emptyGamePiecesImgContainer() {
    const gamePieceContainer = document.querySelector('.game-pieces-container');
    if (gamePieceContainer) removeAllChildren(gamePieceContainer);
}

// Build the DOM image element of the ship
export function buildImgDOM(id, link, length, orientation = 'horizontal') {
    const img = new Image(); 
    img.src = link;
    img.alt = `game piece ${id + 1}`;
    img.classList.add('game-piece-img', 'draggable-element');
    img.id = `piece-${id + 1}`;
    img.setAttribute('orientation', orientation);
    img.setAttribute('shipID', id);
    img.setAttribute('length', length);
    img.style.zIndex = 1;

    return img;
}

// Make the ship DOM element moveable by dragging and dropping
export function makeImgDOMMoveable(imgDOM, gameboardObj) {
    const length = parseInt(imgDOM.getAttribute('length'));
    const id = parseInt(imgDOM.getAttribute('shipid'));
    makePieceMoveable(imgDOM, length, id, gameboardObj);
}