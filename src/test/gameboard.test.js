import { Gameboard } from '../gameboard.js';


/* Place ships down and get list */

test('Place down one ship', () => {
    const board = Gameboard(10);
    board.placeShip(3,3,4,'horizontal');
    expect(board.getShips()).toBe([[3,[3,4],'horizontal']]);
});

test('Place down multiple ships', () => {
    const board = Gameboard(10);
    board.placeShip(3,3,4,'horizontal');
    board.placeShip(2,7,1,'vertical');
    expect(board.getShips()).toBe([[3,[3,4],'horizontal']], [2,[7,1],'vertical']);
});

test('Place down no ships', () => {
    const board = Gameboard(10);
    expect(board.getShips()).toBe([]);
});

/* Display the board in array format */

test('Display board - empty', () => {
    const board = Gameboard(2);
    expect(board.showBoard().toBe([['E','E'],['E','E']]))
});

test('Display board - 1 ship', () => {
    const board = Gameboard(2);
    board.placeShip(2,0,1,'vertical')
    expect(board.showBoard().toBe([['S','S'],['E','E']]))
});