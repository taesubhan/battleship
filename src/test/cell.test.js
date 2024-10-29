import { Cell } from '../cell.js';
import { Ship } from '../ship.js';

test('isHit status - true', () => {
    const cell = Cell();
    cell.hit();
    expect(cell.isHit()).toBe(true);
});

test('isHit status - false', () => {
    const cell = Cell();
    expect(cell.isHit()).toBe(false);
});

test('Store ship', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    const ship = cell.getValue();
    expect(ship.length).toBe(3);
});

test('Store ship - null', () => {
    const cell = Cell();
    const ship = cell.getValue();
    expect(ship).toBeNull();
});

test('Hitting cell should strike the ship object once', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    const ship = cell.getValue();
    expect(ship.getHitCount()).toBe(1);
});

test('Hitting the cell multiple times should strike the ship only once', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    cell.hit();
    cell.hit();
    const ship = cell.getValue();
    expect(ship.getHitCount()).toBe(1);
});

test('Ship object is on cell - true', () => {
    const cell = Cell();
    cell.storeValue(Ship(3));
    expect(cell.hasShip()).toBe(true);
});

test('Ship object is on cell - false', () => {
    const cell = Cell();
    expect(cell.hasShip()).toBe(false);
});

