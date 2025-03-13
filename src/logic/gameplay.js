import { Player } from './player.js';
import { getRandomNum } from './computer.js';
import { Computer } from './computer.js';

//find way to move already placed pieces

export function Gameplay(firstPlayerName = 'Player 1', secondPlayerName = 'Player 2', gameboardSize = 10) {
    let player1;
    let player2;
    let currentPlayer;
    let currentOpponent;
    let currentBoard;
    let opponentBoard;
    let gameBot;

    setUpGame();

    function setUpGame() {
        player1 = Player(firstPlayerName, gameboardSize);
        player2 = Player(secondPlayerName, gameboardSize);
        currentPlayer = player1;
        currentBoard = currentPlayer.getBoard();
        currentOpponent = player2;
        opponentBoard = player2.getBoard();
        gameBot = Computer(currentBoard);
    }

    function getPlayers() {
        return [player1, player2];
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

    function getCurrentOpponent() {
        return currentOpponent;
    }

    function getCurrentPlayerBoard() {
        return currentBoard;
    }

    function getOpponentBoard() {
        return opponentBoard;
    }

    function switchPlayer() {
        opponentBoard = currentBoard;
        currentOpponent = currentPlayer;
        currentPlayer = currentPlayer == player1 ? player2 : player1;
        currentBoard = currentPlayer.getBoard();
    }

    function isGameOver() {
        return opponentBoard.areAllShipsSunk();
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


    function compMakeMove() {
        gameBot.makeComputedAttackOnBoard();
    }


    function reset() {
        setUpGame();
    }


    return {getPlayers, getPlayer1Board, getPlayer2Board, getCurrentPlayer, getCurrentOpponent, getCurrentPlayerBoard, getOpponentBoard, switchPlayer, isGameOver, 
        placeShip, placeShipsRandomly, isLegalMove, makeMove, getIDOfSunkenShipFromCoor, compMakeMove, reset};
    
}
