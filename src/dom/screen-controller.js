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

    const boardsContainer = document.querySelector('.all-game-board-container');
    boardsContainer.classList.add('contains-opponent-board');
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

    const boardsContainer = document.querySelector('.all-game-board-container');
    boardsContainer.classList.add('contains-player-board');
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
}

// Creates a Div element where the game announcements will be displayed
function createMessageBox() {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message-container');

    const gameMessage = document.createElement('div');
    const errorMessage = document.createElement('div');
    gameMessage.classList.add('game-message');
    errorMessage.classList.add('error-message');

    messageBox.appendChild(gameMessage);
    messageBox.appendChild(errorMessage);

    return messageBox;
}

function setUpMessageBox() {
    const textOutput = document.querySelector('.text-output');
    if (textOutput.firstChild) return;
    textOutput.appendChild(createMessageBox());
}

export function displayGameMessage(...messages) {
    clearGameMessage();
    setUpMessageBox();

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
    setUpMessageBox();

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
    const textOutput = document.querySelector('.text-output');
    removeAllChildren(textOutput);
}

export function removeBoards() {
    const opponentBoardContainer = document.querySelector('.opponent-container');
    const playerBoardContainer = document.querySelector('.player-container');
    removeAllChildren(opponentBoardContainer);
    removeAllChildren(playerBoardContainer);

    const boardsContainer = document.querySelector('.all-game-board-container');
    boardsContainer.classList.remove('contains-opponent-board', 'contains-player-board');
}

export function addGamePiecesDOM(gameboardObj) {
    removeGamePiecesImgContainer();

    const boardAndPiecesDOM = document.querySelector('.board-and-pieces');
    const gamePieces = buildGamePiecesImgContainer(gameboardObj);
    boardAndPiecesDOM.appendChild(gamePieces);
}

// Adds text on top of each board that let's players know who's board it is
function displayBoardOwnership() {
    const opponentBoardContainer = document.querySelector('.opponent-container');
    const opponentTitle = document.createElement('p');
    opponentTitle.classList.add('opponent-board-title', 'board-title');
    opponentTitle.textContent = `Opponent's board`;
    opponentBoardContainer.prepend(opponentTitle);

    const playerBoardContainer = document.querySelector('.player-container');
    const playerTitle = document.createElement('p');
    playerTitle.classList.add('player-board-title', 'board-title');
    playerTitle.textContent = `Your board`;
    playerBoardContainer.prepend(playerTitle);
}

// For Player vs. Player mode. Button appears after player makes a move on board
export function createCurrentPlayerDoneButton(gameObj, nextPlayerFunc) {
    
    const turnDoneBtn = document.createElement('button');
    turnDoneBtn.classList.add('turn-complete', 'game-button');
    turnDoneBtn.textContent = 'Next player'
    turnDoneBtn.addEventListener('click', (e) => {
        createNextPlayerButton(gameObj, nextPlayerFunc)
        turnDoneBtn.remove();
    })

    const setUp = document.querySelector('.set-up-input');
    setUp.appendChild(turnDoneBtn);
}

// For Player vs. Player mode. When the screen to prompt player to turn the screen to the other player, this button will be there to prompt next turn
function createNextPlayerButton(gameObj, nextPlayerFunc) {
    const oppName = gameObj.getCurrentOpponent().getName();
    const playerName = gameObj.getCurrentPlayer().getName();

    removeBoards();
    displayGameMessage(`${playerName}, please hand the computer over to ${oppName}`,`${oppName}, click on the "Ready" button to start your turn`);

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('ready-for-next-player', 'game-button');
    nextBtn.textContent = 'Ready'
    nextBtn.addEventListener('click', (e) => {
        nextPlayerFunc(gameObj);
        nextBtn.remove();
    })

    const setUp = document.querySelector('.set-up-input');
    setUp.appendChild(nextBtn);
}


