import { Gameboard } from './gameboard.js';

export function Player(name, size) {
    const board = Gameboard(size);
    return {
        getBoard() {
            return board;
        },

        getName() {
            return name;
        },
    }
}