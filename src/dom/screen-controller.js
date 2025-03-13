import { buildDOMBoard, showAllShipsOnDOMBoard, makeAllShipsOnDOMBoardMoveable, showHitsOnDOMBoard, showAllSunkShipsOnDOMBoard } from './build-board.js';
import { removeAllChildren } from './dom-functions.js';
import { makeBoardDroppable } from './moving-pieces.js';
import { buildGamePiecesImgContainer, removeGamePiecesImgContainer } from './build-piece-img.js';


function displayOpponentBoard(gameObj) {
    const opponentBoardContainer = document.querySelector('.opponent-container');
    removeAllChildren(opponentBoardContainer);

    const opponentBoardObj = gameObj.getOpponentBoard();
    const opponentBoardDOM = buildDOMBoard(opponentBoardObj);
    showHitsOnDOMBoard(opponentBoardDOM, opponentBoardObj);
    showAllSunkShipsOnDOMBoard(opponentBoardDOM, opponentBoardObj);

    opponentBoardDOM.classList.add('opponent-board');
    opponentBoardContainer.appendChild(opponentBoardDOM);
}

export function displayCurrentPlayerBoard(gameObj) {
    const playerBoardContainer = document.querySelector('.player-container');
    removeAllChildren(playerBoardContainer);
    const playerBoardObj = gameObj.getCurrentPlayerBoard();
    const playerBoardDOM = buildDOMBoard(playerBoardObj);
    showAllShipsOnDOMBoard(playerBoardDOM, playerBoardObj);
    showHitsOnDOMBoard(playerBoardDOM, playerBoardObj);

    playerBoardDOM.classList.add('player-board');
    playerBoardContainer.appendChild(playerBoardDOM);
}

export function makePiecesMoveableOnPlayerBoard(gameObj) {
    const playerBoardDOM = document.querySelector('.player-board');
    if (!playerBoardDOM) return;
    const playerBoardObj = gameObj.getCurrentPlayerBoard();
    makeBoardDroppable(playerBoardDOM, gameObj);
    makeAllShipsOnDOMBoardMoveable(playerBoardDOM, playerBoardObj);
}

export function displayAllGameboards(gameObj) {
    displayGameMessage(`${gameObj.getCurrentPlayer().getName()}\'s turn`);
    displayOpponentBoard(gameObj);
    displayCurrentPlayerBoard(gameObj);
    displayBoardOwnership();
}

export function announceWinner(gameObj) {
    displayGameMessage( `${gameObj.getCurrentPlayer().getName()} wins!`)
    // setTimeout(() => displayGameMessage( `${gameObj.getCurrentPlayer().getName()} wins!`), 100);
}

export function displayGameMessage(...messages) {
    clearGameMessage();

    const gameMessageBox = document.querySelector('.game-message');
    for (const message of messages) {
        const p = document.createElement('p');
        p.classList.add('game-message-line', 'text-from-game');
        p.textContent = message;
        gameMessageBox.appendChild(p);
    }
}

export function displayError(...errors) {
    clearError();

    const errorMessageBox = document.querySelector('.error-message');
    for (const err of errors) {
        const p = document.createElement('p');
        p.classList.add('error-message-line', 'text-from-game');
        p.textContent = err;
        errorMessageBox.appendChild(p);
    }
}

export function clearError() {
    const errorMessageBox = document.querySelector('.error-message');
    removeAllChildren(errorMessageBox);
}

function clearGameMessage() {
    const gameMessageBox = document.querySelector('.game-message');
    removeAllChildren(gameMessageBox);
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

function displayBoardOwnership() {
    // const oppName = gameObj.getCurrentOpponent().getName();
    // const playerName = gameObj.getCurrentPlayer().getName();

    const opponentBoardContainer = document.querySelector('.opponent-container');
    const opponentTitle = document.createElement('p');
    opponentTitle.classList.add('opponent-board-title');
    opponentTitle.textContent = `Opponent's board`;
    opponentBoardContainer.prepend(opponentTitle);

    const playerBoardContainer = document.querySelector('.player-container');
    const playerTitle = document.createElement('p');
    playerTitle.classList.add('player-board-title');
    playerTitle.textContent = `Your board`;
    playerBoardContainer.prepend(playerTitle);
}

export function createCurrentPlayerDoneButton(gameObj, nextPlayerFunc) {
    
    const turnDoneBtn = document.createElement('button');
    turnDoneBtn.classList.add('turn-complete');
    turnDoneBtn.textContent = 'Next player'
    turnDoneBtn.addEventListener('click', (e) => {
        createNextPlayerButton(gameObj, nextPlayerFunc)
        turnDoneBtn.remove();
    })

    const setUp = document.querySelector('.set-up-input');
    setUp.appendChild(turnDoneBtn);
}

function createNextPlayerButton(gameObj, nextPlayerFunc) {
    const oppName = gameObj.getCurrentOpponent().getName();
    const playerName = gameObj.getCurrentPlayer().getName();

    removeBoards();
    displayGameMessage(`${playerName}, please hand the computer over to ${oppName}`,`${oppName}, click on the 'ready' button to start your turn`);

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('ready-for-next-player');
    nextBtn.textContent = 'Ready'
    nextBtn.addEventListener('click', (e) => {
        nextPlayerFunc(gameObj);
        nextBtn.remove();
    })

    const setUp = document.querySelector('.set-up-input');
    setUp.appendChild(nextBtn);
}


