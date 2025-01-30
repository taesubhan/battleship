import { Gameboard } from '../logic/gameboard.js';

/* Display the board */

test('Display board - empty', () => {
    const board = Gameboard(2);
    expect(board.showBoard()).toEqual([['E','E'],['E','E']]);
});

/* Placing ships */

test('Place a ship', () => {
    const board = Gameboard(2);
    board.placeShip(2,1,0,'vertical');
    expect(board.showBoard()).toEqual([['E','S'],['E','S']]);
});

test('Place multiple ship', () => {
    const board = Gameboard(3);
    board.placeShip(2,0,0,'horizontal');
    board.placeShip(3,0,1,'horizontal');
    expect(board.showBoard()).toEqual([['S','S','E'],['S','S','S'],['E','E','E']]);
});

test('Length is out of bounds', () => {
    const board = Gameboard(3);
    expect(() => board.placeShip(5,0,0,'horizontal')).toThrow(/^ERROR: Coordinate is out of game board\'s boundary$/);
});

test('x coordinate is out of bounds', () => {
    const board = Gameboard(3);
    expect(() => board.placeShip(1,4,0,'horizontal')).toThrow(/^ERROR: Coordinate is out of game board\'s boundary$/);
});

test('y coordinate is out of bounds', () => {
    const board = Gameboard(3);
    expect(() => board.placeShip(1,0,5,'horizontal')).toThrow(/^ERROR: Coordinate is out of game board\'s boundary$/);
});

test('Overlapping ships', () => {
    const board = Gameboard(3);
    board.placeShip(2,0,0,'horizontal');
    expect(() => board.placeShip(2,1,0,'vertical')).toThrow(/^ERROR: Another ship already occupies this coordinate$/);
});

/* Receiving attack */

test('Receiving an attack and hitting a ship', () => {
    const board = Gameboard(3);
    board.placeShip(2,0,0,'horizontal');
    board.receiveAttack(0,0);
    
    let allShips = board.getAllShips();
    allShips = allShips.map((ship) => [ship.length, ship.getHitCount()]);

    expect(allShips).toEqual([[2,1]]);
});

test('Receiving attacks and hitting multiple ships', () => {
    const board = Gameboard(4);
    board.placeShip(3,0,0,'horizontal');
    board.placeShip(1,1,1,'horizontal');
    board.receiveAttack(0,0);
    board.receiveAttack(1,0);
    board.receiveAttack(1,1);

    let allShips = board.getAllShips();
    allShips = allShips.map((ship) => [ship.length, ship.getHitCount()]);

    expect(allShips).toEqual([[3,2],[1,1]]);
});

test('Receiving attacks on the same coordinate twice', () => {
    const board = Gameboard(4);
    board.placeShip(3,0,0,'horizontal');
    board.placeShip(1,1,1,'horizontal');
    board.receiveAttack(0,0);

    expect(() => board.receiveAttack(0,0)).toThrow();
});

test('Receiving multiple attacks and missing', () => {
    const board = Gameboard(4);
    board.placeShip(2,0,0,'horizontal');
    board.receiveAttack(1,3);
    board.receiveAttack(2,1);

    let allShips = board.getAllShips();
    allShips = allShips.map((ship) => [ship.length, ship.getHitCount()]);

    expect(allShips).toEqual([[2,0]]);
});

test('Receiving attacks on a ship returns true', () => {
    const board = Gameboard(4);
    board.placeShip(3,0,0,'horizontal');

    expect(board.receiveAttack(0,0)).toBe(true);
});

test('Receiving attacks on an empty cell returns true', () => {
    const board = Gameboard(4);
    board.placeShip(1,1,1,'horizontal');

    expect(board.receiveAttack(0,0)).toBe(false);
});

/* Checking whether all ships are sunk */

test('The one and only ship on board having sunk', () => {
    const board = Gameboard(4);
    board.placeShip(2,0,0,'horizontal');
    board.receiveAttack(0,0);
    board.receiveAttack(1,0);

    expect(board.areAllShipsSunk()).toBe(true);
});

test('All ships on board having sunk', () => {
    const board = Gameboard(4);
    board.placeShip(2,0,0,'horizontal');
    board.receiveAttack(0,0);
    board.receiveAttack(1,0);
    board.placeShip(1,1,1,'horizontal');
    board.receiveAttack(1,1);

    expect(board.areAllShipsSunk()).toBe(true);
});

test('Not all ships on board have sunk', () => {
    const board = Gameboard(4);
    board.placeShip(3,0,0,'horizontal');
    board.receiveAttack(0,0);
    board.receiveAttack(1,0);

    expect(board.areAllShipsSunk()).toBe(false);
});

test('Only one of two ships have sunk', () => {
    const board = Gameboard(4);
    board.placeShip(2,0,0,'horizontal');
    board.receiveAttack(0,0);
    board.receiveAttack(1,0);
    
    board.placeShip(2,0,2,'horizontal');
    board.receiveAttack(0,2);

    expect(board.areAllShipsSunk()).toBe(false);
});