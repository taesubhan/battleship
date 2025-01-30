import { buildBoard } from './build-board.js';
import { removeAllChildren } from './dom-functions.js';
import { makeCellsDroppable } from './dragging-pieces.js';
import { buildGamePiecesImgContainer, removeGamePiecesImgContainer } from './build-piece-img.js';
import { addClickListener } from './cell-click.js';

function displayOpponentBoard(gameObj, isBoardClickable = true) {
    const opponentBoardContainer = document.querySelector('.opponent-container');
    removeAllChildren(opponentBoardContainer);
    const opponentBoard = buildBoard(gameObj.getPlayer2Board(), false, true);
    if (isBoardClickable) addClickListener(opponentBoard, gameObj);
    opponentBoard.classList.add('opponent-board');
    opponentBoardContainer.appendChild(opponentBoard);
}

function addDropListener(gameboard, gameObj) {
    makeCellsDroppable(gameboard, gameObj);
}

export function displayPlayerBoard(gameObj, isDroppable = false, piecesDraggable = false) {
    const playerBoardContainer = document.querySelector('.player-container');
    removeAllChildren(playerBoardContainer);
    const playerBoard = buildBoard(gameObj.getPlayer1Board(), true, true, piecesDraggable);
    playerBoard.classList.add('player-board');
    if (isDroppable) {
        addDropListener(playerBoard, gameObj);
    }
    playerBoardContainer.appendChild(playerBoard);
}

export function displayAllGameboards(gameObj, isBoardClickable = true) {
    displayOpponentBoard(gameObj, isBoardClickable);
    displayPlayerBoard(gameObj);
}

function announceWinner(gameObj) {
    const messageBox = document.querySelector('.game-message');
    setTimeout(() => messageBox.textContent = `${gameObj.getCurrentPlayer().getName()} wins!`), 100;
}

export function endGame(gameObj) {
    const playAgainBtn = document.querySelector('.play-again-button');
    
    announceWinner(gameObj)
    playAgainBtn.hidden = false;
}

// function getIntValue(node) {
//     return parseInt(node.value);
// }

// function getCheckedOption(nodeList) {
//     for (const node of nodeList) {
//         if (node.checked) return node.value;
//     }
// }

export function displayError(err) {
    const errorMessageBox = document.querySelector('.error-message');
    errorMessageBox.textContent = err;
}

function clearError() {
    const errorMessageBox = document.querySelector('.error-message');
    errorMessageBox.textContent = '';
}

function clearGameMessage() {
    const gameMessageBox = document.querySelector('.game-message');
    gameMessageBox.textContent = '';
}

export function clearAllMessages() {
    clearError();
    clearGameMessage();
}

export function removeBoards() {
    const opponentBoardContainer = document.querySelector('.opponent-container');
    const playerBoardContainer = document.querySelector('.player-container');
    removeAllChildren(opponentBoardContainer);
    removeAllChildren(playerBoardContainer);
}

export function addGamePiecesDOM(gameboardObj) {
    removeGamePiecesImgContainer();

    const boardAndPiecesDOM = document.querySelector('.board-and-pieces');
    const gamePieces = buildGamePiecesImgContainer(gameboardObj);
    boardAndPiecesDOM.appendChild(gamePieces);
}





