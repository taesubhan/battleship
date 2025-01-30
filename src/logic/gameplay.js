import { Player } from './player.js';

//find way to move already placed pieces

export function Gameplay(firstPlayerName = 'Player 1', secondPlayerName = 'Player 2', gameboardSize = 10) {
    let player1;
    let player2;
    let currentPlayer;
    let playerBoard;
    let opponentBoard;
    let currentBoard;

    setUpGame();

    function setUpGame() {
        player1 = Player(firstPlayerName, gameboardSize);
        player2 = Player(secondPlayerName, gameboardSize);
        currentPlayer = player1;
        currentBoard = currentPlayer.getBoard();
        playerBoard = currentPlayer.getBoard();
        opponentBoard = player2.getBoard();
    }

    function getPlayer1Board() {
        return player1.getBoard();
    }

    function getPlayer2Board() {
        return player2.getBoard();
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function getCurrentPlayerBoard() {
        return playerBoard;
    }

    function getOpponentBoard() {
        return opponentBoard;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer == player1 ? player2 : player1;
        currentBoard = currentPlayer.getBoard();
        opponentBoard = playerBoard;
        playerBoard = currentPlayer.getBoard();
    }

    function isGameOver() {
        return opponentBoard.areAllShipsSunk();
    }

    function placePlayerShip(len, x, y, orientation, id) {
        playerBoard.placeShip(len, x, y, orientation, id);
    }

    function placeShip(len, x, y, orientation, id) {
        return currentBoard.placeShip(len, x, y, orientation, id);
    }

    function placeShipsRandomly(...shipLengths) {
        shipLengths.forEach((len) => {
            if (len < 0 || len >= gameboardSize) throw new Error('One or more of the inputted length(s) are not within the game board dimensions')
        })

        for (let i = 0; i < shipLengths.length; i++) {
            let shipLen = shipLengths[i];
            let legal = false;
            while (!legal) {
                let col = getRandomNum(0, gameboardSize);
                let row = getRandomNum(0, gameboardSize);
                let orientation = getRandomNum(0, 2) === 0 ? 'horizontal' : 'vertical';
                
                if (placeShip(shipLen, col, row, orientation, i)) {
                    legal = true;
                } else {
                    continue;
                }
            }
        }
    }

    function isLegalMove(x, y) {
        return opponentBoard.isLegalAttack(x, y);
    }

    function makeMove(x, y) {
        opponentBoard.receiveAttack(x, y);
    }

    function getIDOfSunkenShipFromCoor(x, y) {
        if (opponentBoard.doesHitSinkShip(x, y)) return opponentBoard.getShipIDFromXY(x, y);
        return null;
    }

    // Get random number between min and max (exclusive);
    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function compMakeMove() {
        let legalMove = false;
        while (!legalMove) {
            let x = getRandomNum(0, gameboardSize);
            let y = getRandomNum(0, gameboardSize);
            legalMove = this.isLegalMove(x,y);
            if(legalMove) opponentBoard.receiveAttack(x,y);
        }
    }

    function reset() {
        setUpGame();
    }


    return {getPlayer1Board, getPlayer2Board, getCurrentPlayer, getCurrentPlayerBoard, getOpponentBoard, switchPlayer, isGameOver, 
        placePlayerShip, placeShip, placeShipsRandomly, isLegalMove, makeMove, getIDOfSunkenShipFromCoor, compMakeMove, reset};
    
}
