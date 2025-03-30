import { Gameplay } from '../logic/gameplay.js';
import { clearAllMessages, clearError, addGamePiecesDOM, displayCurrentPlayerBoard, makePiecesMoveableOnPlayerBoard, 
    displayAllGameboards, removeBoards, displayError, displayGameMessage } from './screen-controller.js';
import { removeGamePiecesImgContainer, emptyGamePiecesImgContainer } from './build-piece-img.js';
import { removeAllChildren } from './dom-functions.js';
import { makeComputerOpponentBoardClickable, makePlayerOpponentBoardClickable } from './cell-click.js';
import shipsJSON from './ships.json' with { type:'json' };
import titleImgFile from '../images/background/battleship-title.png';

let gameObj;
let gameOpponent;
const shipSizes = shipsJSON.map((obj) => obj.length);

export function displayGameTitle() {
    const header = document.querySelector('.header');
    const titleImg = document.createElement('img');
    titleImg.classList.add('title-header'); 
    titleImg.alt = 'Battleship Title';
    titleImg.src = titleImgFile;
    header.appendChild(titleImg);
}

// Where user starts. Need to show option to play against player or computer
export function setUpStartMenu() {
    displayForm(createStartGameOptions());
}

function createStartGameOptions() {
    const form = createForm();
  
    const settingsButton = document.createElement('div');
    settingsButton.classList.add('settings-button');
  
    const vsCompBtn = createVsComputerBtn();
    const vsPlayerBtn = createVsPlayerBtn();
  
    settingsButton.appendChild(vsCompBtn);
    settingsButton.appendChild(vsPlayerBtn);

    form.appendChild(settingsButton);
  
    return form;
}

function createVsComputerBtn() {
    const btn = document.createElement('button');
    btn.classList.add('start-vs-computer-game', 'game-vs-button', 'game-button');
    btn.textContent = 'Vs. Computer'
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        displayPlayerVsComputerForm();
    });
    return btn;
}

function createVsPlayerBtn() {
    const btn = document.createElement('button');
    btn.classList.add('start-vs-player-game', 'game-vs-button', 'game-button');
    btn.textContent = 'Vs. Player'
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        displayPlayerVsPlayerForm();
    });
    return btn;
}

function displayPlayerVsPlayerForm() {
    gameOpponent = 'Player';
    const container = document.createElement('div');
    container.classList.add('input-name-container');
    container.appendChild(createPlayerVsPlayerForm());
    displayForm(container);
}

function displayPlayerVsComputerForm() {
    gameOpponent = 'Computer';
    const container = document.createElement('div');
    container.classList.add('input-name-container');
    container.appendChild(createPlayerVsComputerForm());
    displayForm(container);
}

function startGameBoardSetUpStage() {
    setNewGameObj();
    displayBoardToPlacePieces();
    displayFormForStagingBoard();
}

function setNewGameObj() {
    gameObj = createGameObj(gameOpponent);
}

function displayBoardToPlacePieces() {
    clearAllMessages();

    displayGameMessage(`${gameObj.getCurrentPlayer().getName()}, drag and drop all your ships on the board and click "Start Game"`);
    displayCurrentPlayerBoard(gameObj);
    addGamePiecesDOM(gameObj.getCurrentPlayerBoard());
    makePiecesMoveableOnPlayerBoard(gameObj);
}

function displayForm(form) {
    const setUpContainer = document.querySelector('.set-up-input');
    removeAllChildren(setUpContainer);
    setUpContainer.appendChild(form);
}

export function displayEndGameScreen() {
    const form = createForm();
    const settingsButtonsContainer = document.createElement('div');
    settingsButtonsContainer.classList.add('settings-button');
    const replayButton = createReplayButton();
    
    settingsButtonsContainer.appendChild(replayButton);

    form.appendChild(settingsButtonsContainer);
    displayForm(form);
}

function displayFormForStagingBoard() {
    const newForm = createForm();
    const settingsButtonsContainer = document.createElement('div');
    settingsButtonsContainer.classList.add('settings-button');
    const randomizeShipsButton = createRandomizeShipsButton();
    const startGameButton = createStartGameButton();
    
    settingsButtonsContainer.appendChild(randomizeShipsButton);
    settingsButtonsContainer.appendChild(startGameButton);
    newForm.appendChild(settingsButtonsContainer);

    displayForm(newForm);
}

function createForm() {
    const form = document.createElement('form');
    form.action = "";
    form.classList.add('game-set-up-form');

    return form;
}

// Button to submit player 1 name
function createSubmitNameButton() {
    const submitNameButton = document.createElement('button');
    submitNameButton.classList.add('submit-name', 'game-button');
    submitNameButton.textContent = "Ready";

    enableSubmitNameButton(submitNameButton);

    return submitNameButton;
}

function createStartGameButton() {
    const startButton = document.createElement('button');
    startButton.classList.add('start-game-button', 'board-set-up-button', 'game-button');
    startButton.textContent = "Start Game";

    enableStartGameButton(startButton);

    return startButton;
}

function createRandomizeShipsButton() {
    const randomizeShipsButton = document.createElement('button');
    randomizeShipsButton.classList.add('randomize-ships-button', 'board-set-up-button', 'game-button');
    randomizeShipsButton.textContent = "Randomize";
    enableRandomizeShipsButton(randomizeShipsButton);

    return randomizeShipsButton;
}

function createReplayButton() {
    const replayButton = document.createElement('button');
    replayButton.classList.add('play-again-button', 'game-button');
    replayButton.textContent = "Play Again";
    enableReplayButton(replayButton);

    return replayButton;
}

// Input box for Player 1 to type in their name
function createPlayerNameInput(playerNum) {
    if (typeof playerNum != 'number') return;
    const playerNameInput = document.createElement('div');
    playerNameInput.classList.add(`player${playerNum}-name-input`);
  
    const playerNameLabel = document.createElement('label');
    playerNameLabel.classList.add(`player-name-label`);
    playerNameLabel.htmlFor = `player${playerNum}-name`;
    playerNameLabel.textContent = `Player ${playerNum} name: `;
  
    const playerNameInputBox = document.createElement('input');
    playerNameInputBox.classList.add('player-name-input');
    playerNameInputBox.type = "text";
    playerNameInputBox.id = `player${playerNum}-name`;
  
    playerNameInput.appendChild(playerNameLabel);
    playerNameInput.appendChild(playerNameInputBox);

    return playerNameInput;
}

function createPlayerVsComputerForm() {
    const form = createForm();
  
    const player1NameInput = createPlayerNameInput(1);
  
    const settingsButton = document.createElement('div');
    settingsButton.classList.add('settings-button');
  
    const submitNameButton = createSubmitNameButton();
  
    settingsButton.appendChild(submitNameButton);

    form.appendChild(player1NameInput);
    form.appendChild(settingsButton);
  
    return form;
}

function createPlayerVsPlayerForm() {
    const form = createForm();
  
    const player1NameInput = createPlayerNameInput(1);
    const player2NameInput = createPlayerNameInput(2);
  
    const settingsButton = document.createElement('div');
    settingsButton.classList.add('settings-button');
  
    const submitNameButton = createSubmitNameButton();
  
    settingsButton.appendChild(submitNameButton);

    form.appendChild(player1NameInput);
    form.appendChild(player2NameInput);
    form.appendChild(settingsButton);
  
    return form;
}

function createGameObj(gameOpponent) {
    const player1Name = document.querySelector('#player1-name');
    const player2Name = document.querySelector('#player2-name');
    let p1Name;
    let p2Name;

    if (gameOpponent == 'Computer') {
        p1Name = player1Name.value === '' ? 'Player 1' : player1Name.value;
        p2Name = 'Computer';
    } else if (gameOpponent = 'Player') {
        p1Name = player1Name.value === '' ? 'Player 1' : player1Name.value;
        p2Name = player2Name.value === '' ? 'Player 2' : player2Name.value;
    }

    const newGame = Gameplay(p1Name, p2Name);
    return newGame;
}

function removeForm() {
    document.querySelector('.game-set-up-form').remove();
}

function setComputerPiecesOnBoard() {
    gameObj.switchPlayer();
    gameObj.placeShipsRandomly(...shipSizes); // Places computer ship randomly
    gameObj.switchPlayer();
}

function displayScreenToStartMatch() {
    clearAllMessages();
    removeForm();
    removeGamePiecesImgContainer();

    displayAllGameboards(gameObj);
    if (gameOpponent == 'Computer') {
        makeComputerOpponentBoardClickable(gameObj);
    } else if (gameOpponent == 'Player') {
        makePlayerOpponentBoardClickable(gameObj);
    }
}

function enableStartGameButton(startButton) {
    startButton.addEventListener('click', (e) => {
        e.preventDefault();

        const form = document.querySelector('.game-set-up-form');
        if (!form.reportValidity()) {
            return;
        }
    
        if (gameObj.getCurrentPlayerBoard().getShipCount() < shipsJSON.length) {
            displayError('Place all ships on board before starting game!');
            return;
        }
        
        if (gameOpponent == 'Computer') {
            setComputerPiecesOnBoard();
            displayScreenToStartMatch();
            
        } else if (gameOpponent == 'Player') {
            gameObj.switchPlayer();
            
            // First player just placed their pieces on the board. Second player's turn to place their pieces
            if (gameObj.getCurrentPlayer() == gameObj.getPlayers()[1]) {
                displayBoardToPlacePieces();
            // Second player just placed their pieces on the board. Game will begin starting with the first player
            } else if (gameObj.getCurrentPlayer() == gameObj.getPlayers()[0]) {
                displayScreenToStartMatch();
            }
        }
    })
}


function enableSubmitNameButton(submitNameButtonDOM) {
    submitNameButtonDOM.addEventListener('click', (e) => {
        const form = document.querySelector('.game-set-up-form');
        if (!form.reportValidity()) {
            return;
        }
        e.preventDefault();

        startGameBoardSetUpStage();
    })
}

function enableRandomizeShipsButton(randomizeButton) {
    randomizeButton.addEventListener('click', (e) => {
        const form = document.querySelector('.game-set-up-form');
        if (!form.reportValidity()) {
            return;
        }
        e.preventDefault();

        gameObj.placeShipsRandomly(...shipSizes);

        displayCurrentPlayerBoard(gameObj);
        makePiecesMoveableOnPlayerBoard(gameObj);
        emptyGamePiecesImgContainer();
        clearError();
    })
}

// Need to make adjust createGameObj to adjust for whether player is playing agian.
function enableReplayButton(replayButton) {
    replayButton.addEventListener('click' , (e) => {
        e.preventDefault();
        
        const form = document.querySelector('.game-set-up-form');
        if (!form.reportValidity()) {
            return;
        }
    
        clearAllMessages();
        removeBoards();
        setUpStartMenu();
    })
}



