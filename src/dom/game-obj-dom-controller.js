import shipsJSON from './ships.json' with { type:'json' };

let gameObj;
const shipSizes = shipsJSON.map((obj) => obj.length);


// export function setUpGameSettings() {
//     const form = document.querySelector('.game-set-up-form');
//     const playerName = document.querySelector('#player1-name');

//     const startGameBtn = document.querySelector('.start');
//     const randomizeBtn = document.querySelector('.randomize-ships-button');
//     const submitSettingsBtn = document.querySelector('.submit-settings-button');
//     const playAgainBtn = document.querySelector('.play-again-button');

//     const shipSizes = shipsJSON.map((obj) => obj.length);

//     let gameObj;

//     function createGameObj() {
//         const name = playerName.value === '' ? 'Player 1' : playerName.value;
//         const game = Gameplay(name, 'Player 2');
//         return game;
//     }


//     startGameBtn.addEventListener('click', (e) => {
//         if (!form.reportValidity()) {
//             return;
//         }
//         e.preventDefault();

//         displayBoardToSetUp();
//     })

//     randomizeBtn.addEventListener('click', (e) => {
//         if (!form.reportValidity()) {
//             return;
//         }
//         e.preventDefault();

//         gameObj.placeShipsRandomly(...shipSizes);

//         displayPlayerBoard(gameObj);
//         makePiecesMoveableOnPlayerBoard(gameObj);
//         removeGamePiecesImgContainer();
//         clearAllMessages();
//     })

//     submitSettingsBtn.addEventListener('click', (e) => {
//         if (!form.reportValidity()) {
//             return;
//         }

//         e.preventDefault();

//         if (gameObj.getCurrentPlayerBoard().getShipCount() < shipsJSON.length) {
//             displayError('Place all ships on board before starting game!');
//             return;
//         }
        
//         gameObj.switchPlayer();

//         gameObj.placeShipsRandomly(...shipSizes); // Places computer ship randomly

//         gameObj.switchPlayer();

//         displayAllGameboards(gameObj);
//         makeOpponentBoardClickable(gameObj);
//         removeGamePiecesImgContainer();
//         clearAllMessages();
//     });

//     playAgainBtn.addEventListener('click', (e) => {
//         if (!form.reportValidity()) {
//             return;
//         }
//         e.preventDefault();

//         removeBoards();
//         displayBoardToSetUp();
//     })
// }