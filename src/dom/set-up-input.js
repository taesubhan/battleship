import { Gameplay } from '../logic/gameplay.js';
import { clearAllMessages, addGamePiecesDOM, displayPlayerBoard, displayAllGameboards, removeBoards, displayError } from './screen-controller.js';
import { removeGamePiecesImgContainer } from './build-piece-img.js';

import shipsJSON from './ships.json' with { type:'json' };

export function setUpGameSettings() {
    const form = document.querySelector('.game-set-up-form');
    const playerName = document.querySelector('#player1-name');

    const startGameBtn = document.querySelector('.start');
    const randomizeBtn = document.querySelector('.randomize-ships-button');
    const submitSettingsBtn = document.querySelector('.submit-settings-button');
    const playAgainBtn = document.querySelector('.play-again-button');

    const shipSizes = shipsJSON.map((obj) => obj.length);

    let gameObj;

    function createGameObj() {
        const name = playerName.value === '' ? 'Player 1' : playerName.value;
        const game = Gameplay(name, 'Player 2');
        return game;
    }

    function displayBoardToSetUp() {
        clearAllMessages();
        gameObj = createGameObj();

        document.querySelector('.player1-name-input').hidden = true;

        addGamePiecesDOM(gameObj.getCurrentPlayerBoard());
        form.hidden = false;
        startGameBtn.hidden = true;
        randomizeBtn.hidden = false;
        submitSettingsBtn.hidden = false;
        playAgainBtn.hidden = true;

        displayPlayerBoard(gameObj, true);
    }

    startGameBtn.addEventListener('click', (e) => {
        if (!form.reportValidity()) {
            return;
        }
        e.preventDefault();

        displayBoardToSetUp();
    })

    randomizeBtn.addEventListener('click', (e) => {
        if (!form.reportValidity()) {
            return;
        }
        e.preventDefault();

        gameObj.placeShipsRandomly(...shipSizes);

        displayPlayerBoard(gameObj, true, true);
        removeGamePiecesImgContainer();
        clearAllMessages();
    })

    submitSettingsBtn.addEventListener('click', (e) => {
        if (!form.reportValidity()) {
            return;
        }

        e.preventDefault();

        console.log(gameObj.getCurrentPlayerBoard().getShipCount());
        console.log(shipsJSON.length);

        if (gameObj.getCurrentPlayerBoard().getShipCount() < shipsJSON.length) {
            displayError('Place all ships on board before starting game!');
            return;
        }
        
        gameObj.switchPlayer();

        gameObj.placeShipsRandomly(...shipSizes); // Places computer ship randomly

        gameObj.switchPlayer();

        displayAllGameboards(gameObj);

        form.hidden = true;
        removeGamePiecesImgContainer();

        clearAllMessages();
    });

    playAgainBtn.addEventListener('click', (e) => {
        if (!form.reportValidity()) {
            return;
        }
        e.preventDefault();

        removeBoards();
        displayBoardToSetUp();
    })
}