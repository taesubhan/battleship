import { Cell } from './cell.js';

function createBoard(size) {
    const board = new Array(size);
    board.forEach(() => Array.from(new Array(size), () => Cell()));
    return board;
}

export function Gameboard(size) {
    const board = createBoard(size);
    return {

    }
}