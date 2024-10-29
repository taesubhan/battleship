import { Ship } from '../ship.js';

/* Length of ship */

test('Length of ship', () => {
    expect(Ship(3).length).toBe(3);
});

/* getHitCount() */

test('How many times ship has been hit - no hits', () => {
    const ship = Ship(4);
    expect(ship.getHitCount()).toBe(0);
});

test('How many times ship has been hit - 2 hits', () => {
    const ship = Ship(4);
    ship.hit();
    ship.hit();
    expect(ship.getHitCount()).toBe(2);
});

test('How many times ship has been hit - More hits than length', () => {
    const ship = Ship(2);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.getHitCount()).toBe(2);
});

/* isSunk() */

test('Ship sunk - false', () => {
    const ship = Ship(5);
    expect(ship.isSunk()).toBe(false);
});

test('Ship sunk - false, hit less than length times', () => {
    const ship = Ship(5);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test('Ship sunk - true', () => {
    const ship = Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('Ship sunk - true, hit more than length times', () => {
    const ship = Ship(2);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

